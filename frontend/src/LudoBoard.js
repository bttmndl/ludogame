import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import LudoTrianglePlayerBox from "./components/LuduBoard/LudoTrianglePlayerBox";
import LudoStarBoxes from "./components/LuduBoard/LudoStarBoxes";
import LudoMarkerGoti from "./components/LuduBoard/LudoMarkerGoti";
import LudoWinBox from "./components/LuduBoard/LudoWinBox";
import LudoPolygon from "./components/LuduBoard/LudoPolygon";
import LudoBoxes from "./components/LuduBoard/LudoBoxes";
import { generatePolygonCordinates } from "./geometry/polygon";
import { generateLineCordinates } from "./geometry/lines";
import { generateBoxesFromLineCoordinates } from "./geometry/boxes";
import { generateDropdownMarker } from "./geometry/markers";
import { generateTriangleCordForPlayerBox } from "./geometry/triangles";
import { generateInnerTriangleCordForPlayerBox } from "./geometry/innerTriangle";
import { generateWinBoxCord } from "./geometry/winbox";
import { generateCircleCordForPlayer } from "./geometry/circle";
import { generateHomeDropdownMarker } from "./geometry/homeMarkers";
import { playSound } from "./soundEffects";

// Constants
const POLYGON_SIZE = 80;

/* ================= DYNAMIC HELPERS ================= */

function generatePlayers(playerCount, totalCells) {
  return Array.from({ length: playerCount }, (_, i) => ({
    id: i,
    start: i === 0 ? totalCells - 4 : i * 18 - 4,
    isAI: true,
  }));
}

function generateSafeCells(players) {
  // The starting positions are the safe cells.
  const res = [];
  players.forEach((p) =>
    res.push(p.start - 1, (p.start + 7) % (18 * players.length)),
  );
  return res;
}

function createInitialGotis(players) {
  const gotis = [];
  players.forEach((p) => {
    for (let i = 0; i < 4; i++) {
      gotis.push({
        id: `${p.id}-${i}`,
        playerId: p.id,
        position: -1, // home
        finished: false,
      });
    }
  });
  return gotis;
}

function LudoBoard({
  playerCount,
  SVG_SIZE,
  online = false,
  enableBots = false,
  localPlayerId = null,
  remoteGameState = null,
  remoteAction = null,
  onRollDice,
  onMoveGoti,
  onGameStateChange,
  onTurnChange,
}) {

  const TOTAL_CELLS = playerCount * 18;
  const [isRolling, setIsRolling] = useState(false);

  const PLAYERS = useMemo(
    () => generatePlayers(playerCount, TOTAL_CELLS),
    [playerCount, TOTAL_CELLS],
  );

  const SAFE_CELLS = useMemo(() => generateSafeCells(PLAYERS), [PLAYERS]);

  /* ---------- GAME STATE ---------- */

  const [game, setGame] = useState(() => ({
    currentPlayer: 0,
    dice: null,
    gotis: createInitialGotis(PLAYERS),
    winner: null,
  }));

  const [moveRequest, setMoveRequest] = useState(null);
  const lastDiceRef = useRef(null);
  const lastTurnRef = useRef(0);
  const lastWinnerRef = useRef(null);
  const skipNextDiceSoundRef = useRef(false);
  const skipNextMoveStartSoundRef = useRef(false);

  const isHumanTurn = useCallback((playerId = game.currentPlayer) => {
    if (online) return localPlayerId === playerId;
    if (enableBots) return localPlayerId === playerId;
    return true;
  }, [game.currentPlayer, online, enableBots, localPlayerId]);

  const calculateMove = useCallback(
    (goti, dice) => {
      const LADDER_JUMP = 6;
      const isLadderCell = (pos) => pos % 18 === 6;

      const player = PLAYERS.find((p) => p.id === goti.playerId);

      const hasOpponent = (pos) =>
        !SAFE_CELLS.includes(pos) &&
        game.gotis.some(
          (g) => g.position === pos && g.playerId !== goti.playerId,
        );

      if (goti.position === -1) {
        const path = [];
        let currentPos = player.start - 1;

        for (let i = 0; i < dice; i++) {
          currentPos = (currentPos + 1) % TOTAL_CELLS;
          path.push(currentPos);
        }

        const newPosition = path[path.length - 1];

        return {
          path,
          newPosition,
          finished: false,
          ate: hasOpponent(newPosition),
        };
      }

      const path = [];
      let currentPos = goti.position;
      const canEnterHome =
        player.start - currentPos <= 12 && player.start - currentPos > 0;

      if (canEnterHome) {
        if (currentPos + dice >= player.start - 1) return null;
        const finished = currentPos + dice === player.start - 2;
        for (let i = 0; i < dice; i++) {
          currentPos = (currentPos + 1) % TOTAL_CELLS;
          path.push(currentPos);
        }
        const newPosition = goti.position + dice;
        return { path, newPosition, finished, ate: hasOpponent(newPosition) };
      }

      for (let i = 0; i < dice; i++) {
        if (isLadderCell(currentPos)) {
          currentPos = (currentPos + LADDER_JUMP) % TOTAL_CELLS;
          path.push(currentPos);
        } else {
          currentPos = (currentPos + 1) % TOTAL_CELLS;
          path.push(currentPos);
        }
      }

      const newPosition = path[path.length - 1];
      return {
        path,
        newPosition,
        finished: false,
        ate: hasOpponent(newPosition),
      };
    },
    [game.gotis, PLAYERS, SAFE_CELLS, TOTAL_CELLS],
  );

  const requestMove = useCallback((gotiId, playerId = game.currentPlayer, options = {}) => {
    const rejectMove = () => {
      if (options.feedback) playSound("blocked");
      return false;
    };

    // 1. Check if dice is rolled, not animating, and no winner
    if (!game.dice || isRolling || game.winner !== null) return rejectMove();
    if (online && playerId !== game.currentPlayer) return rejectMove();
    if (enableBots && !isHumanTurn(playerId)) {
      if (playerId === localPlayerId) return rejectMove();
    }

    // 2. Find the goti
    const goti = game.gotis.find((g) => g.id === gotiId);
    if (!goti || goti.playerId !== playerId || goti.finished) return rejectMove();

    // 3. Calculate the move
    const move = calculateMove(goti, game.dice);
    if (!move) return rejectMove();

    if (options.sound !== false) {
      playSound(goti.position === -1 ? "open" : "select");
    }

    // 4. Set up the animation request
    setIsRolling(true);
    setMoveRequest({
      gotiId,
      steps: game.dice,
      ...move,
    });
    return true;
  }, [
    game.currentPlayer,
    game.dice,
    game.gotis,
    game.winner,
    isRolling,
    online,
    enableBots,
    isHumanTurn,
    localPlayerId,
    calculateMove,
    setIsRolling,
    setMoveRequest,
  ]);

  useEffect(() => {
    if (remoteGameState) {
      setGame(remoteGameState);
      setMoveRequest(null);
      setIsRolling(false);
    }
  }, [remoteGameState]);

  useEffect(() => {
    if (lastDiceRef.current === null && game.dice !== null) {
      if (skipNextDiceSoundRef.current) {
        skipNextDiceSoundRef.current = false;
      } else {
        playSound("dice");
      }
    }

    lastDiceRef.current = game.dice;
  }, [game.dice]);

  useEffect(() => {
    if (lastTurnRef.current !== game.currentPlayer) {
      playSound(isHumanTurn(game.currentPlayer) ? "turn" : "status");
      lastTurnRef.current = game.currentPlayer;
    }
  }, [game.currentPlayer, isHumanTurn]);

  useEffect(() => {
    if (lastWinnerRef.current !== game.winner && game.winner !== null) {
      playSound("win");
    }

    lastWinnerRef.current = game.winner;
  }, [game.winner]);

  useEffect(() => {
    if (!remoteAction) return;

    if (remoteAction.type === "roll") {
      setGame((prev) => {
        if (
          prev.winner !== null ||
          prev.dice ||
          prev.currentPlayer !== remoteAction.playerId
        ) {
          return prev;
        }

        const next = { ...prev, dice: remoteAction.dice };
        if (remoteAction.playerId === localPlayerId) {
          window.setTimeout(() => onGameStateChange?.(next), 0);
        }
        return next;
      });
      return;
    }

    if (remoteAction.type === "move") {
      const skipStartSound =
        remoteAction.playerId === localPlayerId &&
        skipNextMoveStartSoundRef.current;

      skipNextMoveStartSoundRef.current = false;
      requestMove(remoteAction.gotiId, remoteAction.playerId, {
        sound: !skipStartSound,
      });
    }
  }, [remoteAction, localPlayerId, requestMove, onGameStateChange]);

  useEffect(() => {
    if (!enableBots || online || game.winner !== null || isRolling) return;
    if (game.currentPlayer === localPlayerId) return;

    if (!game.dice) {
      const timer = setTimeout(() => {
        const diceValue = Math.floor(Math.random() * 6) + 1;
        setGame((prev) => {
          if (
            prev.winner !== null ||
            prev.dice ||
            prev.currentPlayer === localPlayerId
          ) {
            return prev;
          }

          return { ...prev, dice: diceValue };
        });
      }, 700);

      return () => clearTimeout(timer);
    }

    const botGotis = game.gotis.filter(
      (g) => g.playerId === game.currentPlayer && !g.finished,
    );
    const movableGoti =
      botGotis.find((g) => g.position >= 0 && calculateMove(g, game.dice)) ||
      botGotis.find((g) => calculateMove(g, game.dice));

    if (!movableGoti) return;

    const timer = setTimeout(() => {
      requestMove(movableGoti.id, game.currentPlayer);
    }, 650);

    return () => clearTimeout(timer);
  }, [
    enableBots,
    online,
    game.currentPlayer,
    game.dice,
    game.gotis,
    game.winner,
    isRolling,
    localPlayerId,
    requestMove,
    calculateMove,
  ]);

  // Auto-pass turn if no moves possible, or if there is a winner
  useEffect(() => {
    if (game.winner !== null) return;

    if (game.dice && !isRolling) {
      const playerGotis = game.gotis.filter(
        (g) => g.playerId === game.currentPlayer,
      );
      const canMove = playerGotis.some((g) => {
        if (g.finished) return false;
        // any goti can move if it's not an exact-win situation
        const move = calculateMove(g, game.dice);
        return move !== null;
      });

      if (!canMove) {
        const timer = setTimeout(() => {
          setGame((prev) => ({
            ...prev,
            dice: null,
            currentPlayer: (prev.currentPlayer + 1) % PLAYERS.length,
          }));
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [
    game.dice,
    game.currentPlayer,
    game.gotis,
    isRolling,
    PLAYERS.length,
    game.winner,
    calculateMove,
  ]);

  function onMoveComplete(gotiId /*, finalBox is ignored */) {
    if (!moveRequest || moveRequest.gotiId !== gotiId) return;

    if (moveRequest.ate) {
      playSound("capture");
    } else if (moveRequest.finished) {
      playSound("finish");
    } else {
      playSound("land");
    }

    setGame((prev) => {
      const { newPosition, finished, ate } = moveRequest;

      // 1️⃣ Update goti that moved
      let gotis = prev.gotis.map((g) =>
        g.id === gotiId ? { ...g, position: newPosition, finished } : g,
      );

      // 2️⃣ Handle EAT (if it happened)
      if (ate) {
        gotis = gotis.map((g) => {
          // find the eaten goti(s) at the destination
          if (
            g.position === newPosition &&
            g.id !== gotiId &&
            g.playerId !== prev.currentPlayer
          ) {
            return { ...g, position: -1 }; // send it home
          }
          return g;
        });
      }

      // 3️⃣ Check for WINNER
      let winner = prev.winner;
      if (finished) {
        const playerGotis = gotis.filter(
          (g) => g.playerId === prev.currentPlayer,
        );
        if (playerGotis.every((g) => g.finished)) {
          winner = prev.currentPlayer;
        }
      }

      // 4️⃣ Change turn
      const rolledSix = prev.dice === 6;
      const nextPlayer =
        rolledSix || ate
          ? prev.currentPlayer
          : (prev.currentPlayer + 1) % PLAYERS.length;

      const nextGame = {
        ...prev,
        gotis,
        dice: winner !== null ? prev.dice : null, // keep dice value on win
        currentPlayer: winner !== null ? prev.currentPlayer : nextPlayer,
        winner,
      };

      if (!online || prev.currentPlayer === localPlayerId) {
        window.setTimeout(() => onGameStateChange?.(nextGame), 0);
      }

      return nextGame;
    });

    // 5️⃣ Clear move request
    setMoveRequest(null);
    setIsRolling(false);
  }

  function handleAnimation(gotiId) {
    if (online) {
      if (!game.dice || isRolling || game.winner !== null) {
        playSound("blocked");
        return;
      }
      if (localPlayerId !== game.currentPlayer) {
        playSound("blocked");
        return;
      }
      const goti = game.gotis.find((g) => g.id === gotiId);
      if (!goti || goti.playerId !== localPlayerId) {
        playSound("blocked");
        return;
      }
      if (!calculateMove(goti, game.dice)) {
        playSound("blocked");
        return;
      }
      skipNextMoveStartSoundRef.current = true;
      playSound(goti.position === -1 ? "open" : "select");
      onMoveGoti?.(gotiId);
      window.setTimeout(() => {
        skipNextMoveStartSoundRef.current = false;
      }, 1500);
      return;
    }

    if (enableBots && !isHumanTurn()) {
      playSound("blocked");
      return;
    }

    requestMove(gotiId, game.currentPlayer, { feedback: true });
  }

  /* ================= COLORS ================= */

  const numberWiseColor = useMemo(() => {
    return Array.from({ length: playerCount }, (_, i) => {
      const hue = (i * 360) / playerCount;
      return `hsl(${hue}, 70%, 50%)`;
    });
  }, [playerCount]);

  useEffect(() => {
    onTurnChange?.({
      currentPlayer: game.currentPlayer,
      colors: numberWiseColor,
    });
  }, [game.currentPlayer, numberWiseColor, onTurnChange]);

  /* ================= GEOMETRY ================= */

  const polygonData = useMemo(
    () =>
      generatePolygonCordinates(
        SVG_SIZE / 2,
        SVG_SIZE / 2,
        playerCount,
        POLYGON_SIZE,
      ),
    [SVG_SIZE, playerCount],
  );

  const polygonDataSmall = useMemo(() => {
    return generatePolygonCordinates(
      SVG_SIZE / 2,
      SVG_SIZE / 2,
      playerCount,
      POLYGON_SIZE / 1.7,
    );
  }, [playerCount, SVG_SIZE]);

  const lineCoordinates = useMemo(() => {
    return generateLineCordinates(polygonData, playerCount);
  }, [polygonData, playerCount]);

  const boxes = useMemo(() => {
    return generateBoxesFromLineCoordinates(lineCoordinates);
  }, [lineCoordinates]);

  const markers = useMemo(() => {
    return generateDropdownMarker(boxes);
  }, [boxes]);

  const [triangleCoordsArray, triangleCoordsStringArray] = useMemo(() => {
    return generateTriangleCordForPlayerBox(lineCoordinates);
  }, [lineCoordinates]);

  const triangleInnerCordsArray = useMemo(() => {
    return generateInnerTriangleCordForPlayerBox(triangleCoordsArray);
  }, [triangleCoordsArray]);

  const circleCoordinates = useMemo(() => {
    return generateCircleCordForPlayer(triangleCoordsArray);
  }, [triangleCoordsArray]);

  const homeMarkers = useMemo(() => {
    return generateHomeDropdownMarker(circleCoordinates);
  }, [circleCoordinates]);

  const winBoxCordLine = useMemo(() => {
    return generateWinBoxCord(polygonData, polygonDataSmall);
  }, [polygonData, polygonDataSmall]);

  // const starCords = useMemo(() => {
  //   return generateStarPolygon(boxes, playerCount);
  // }, [boxes, playerCount]);f
  return (
    <div className="boardShell">
      <svg
        className="ludoBoardSvg"
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        role="img"
        aria-label="Ludo board"
      >

        {/* ---------- DICE & WINNER UI ---------- */}
        <g
          transform={`translate(${SVG_SIZE / 2}, ${SVG_SIZE / 2})`}
          style={{
            cursor:
              isRolling || game.dice || game.winner !== null
                ? "not-allowed"
                : "pointer",
          }}
          onClick={() => {
            if (isRolling || game.dice || game.winner !== null) {
              playSound("blocked");
              return;
            }
            if (online && localPlayerId !== game.currentPlayer) {
              playSound("blocked");
              return;
            }
            if (enableBots && !isHumanTurn()) {
              playSound("blocked");
              return;
            }

            // roll dice only (no move yet)
            const diceValue = Math.floor(Math.random() * 6) + 1;
            if (online) {
              skipNextDiceSoundRef.current = true;
              playSound("dice");
              onRollDice?.(diceValue);
              window.setTimeout(() => {
                skipNextDiceSoundRef.current = false;
              }, 1500);
            } else {
              setGame((prev) => ({ ...prev, dice: diceValue }));
            }
          }}
        >
          <rect
            x={-45}
            y={-45}
            width={90}
            height={90}
            rx={12}
            fill="white"
            stroke={numberWiseColor[game.currentPlayer]}
            strokeWidth={4}
          />

          <text
            x={0}
            y={15}
            textAnchor="middle"
            fontSize={game.winner !== null ? 24 : 48}
            fontWeight="bold"
            fill={numberWiseColor[game.currentPlayer]}
          >
            {game.winner !== null
              ? `P${game.winner + 1} WINS!`
              : (game.dice ?? "🎲")}
          </text>
        </g>

        <LudoBoxes
          lineCoordinates={lineCoordinates}
          handleAnimation={handleAnimation}
          numberWiseColor={numberWiseColor}
          playerCount={playerCount}
        />

        <LudoPolygon
          polygonData={polygonData}
          polygonDataSmall={polygonDataSmall}
        />

        <LudoTrianglePlayerBox
          numberWiseColor={numberWiseColor}
          triangleCoordsStringArray={triangleCoordsStringArray}
          circleCoordinates={circleCoordinates}
          triangleInnerCordsArray={triangleInnerCordsArray}
        />

        <LudoWinBox
          winBoxCordLine={winBoxCordLine}
          numberWiseColor={numberWiseColor}
          playerCount={playerCount}
        />

        <LudoStarBoxes
          numberWiseColor={numberWiseColor}
          playerCount={playerCount}
          lineCoordinates={lineCoordinates}
        />

        <LudoMarkerGoti
          winBoxCordLine={winBoxCordLine}
          gotis={game.gotis}
          markers={markers}
          homeMarkers={homeMarkers}
          circleCoordinates={circleCoordinates}
          moveRequest={moveRequest}
          onMoveComplete={onMoveComplete}
          numberWiseColor={numberWiseColor}
          currentPlayer={game.currentPlayer}
          localPlayerId={
            online || enableBots ? localPlayerId : game.currentPlayer
          }
          handleAnimation={handleAnimation}
          PLAYERS={PLAYERS}
        />
      </svg>
    </div>
  );
}

export default LudoBoard;
