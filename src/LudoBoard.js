import React, { useEffect, useMemo, useRef, useState } from "react";
import LudoCircle from "./components/LuduBoard/LudoCircle";
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
import { generateStarPolygon } from "./geometry/star";
import { generateWinBoxCord } from "./geometry/winbox";
import { generateCircleCordForPlayer } from "./geometry/circle";
import { generateHomeDropdownMarker } from "./geometry/homeMarkers";

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

function generateSafeCells(players, totalCells) {
  // The starting positions are the safe cells.
  return players.map((p) => p.start);
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

function LudoBoard({ playerCount, SVG_SIZE }) {
  const TOTAL_CELLS = playerCount * 18;
  const CIRCLE_RADIUS = SVG_SIZE / 2 - 4;
  const HOME_LANE_LENGTH = 7; // 6 squares to move on + 1 winning spot

  const [isRolling, setIsRolling] = useState(false);

  const PLAYERS = useMemo(
    () => generatePlayers(playerCount, TOTAL_CELLS),
    [playerCount, TOTAL_CELLS],
  );

  const SAFE_CELLS = useMemo(
    () => generateSafeCells(PLAYERS, TOTAL_CELLS),
    [PLAYERS, TOTAL_CELLS],
  );

  /* ---------- GAME STATE ---------- */

  const [game, setGame] = useState(() => ({
    currentPlayer: 0,
    dice: null,
    gotis: createInitialGotis(PLAYERS),
    winner: null,
  }));

  const [moveRequest, setMoveRequest] = useState(null);

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
  ]);

  function onMoveComplete(gotiId /*, finalBox is ignored */) {
    if (!moveRequest || moveRequest.gotiId !== gotiId) return;

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

      return {
        ...prev,
        gotis,
        dice: winner !== null ? prev.dice : null, // keep dice value on win
        currentPlayer: winner !== null ? prev.currentPlayer : nextPlayer,
        winner,
      };
    });

    // 5️⃣ Clear move request
    setMoveRequest(null);
    setIsRolling(false);
  }

  const calculateMove = (goti, dice) => {
    const LADDER_JUMP = 6;
    const isLadderCell = (pos) => pos % 18 === 6;

    const player = PLAYERS.find((p) => p.id === goti.playerId);

    // Helper to check if opponent goti exists at position
    const hasOpponent = (pos) =>
      !SAFE_CELLS.includes(pos) &&
      game.gotis.some(
        (g) => g.position === pos && g.playerId !== goti.playerId,
      );

    // 1. Spawning from home
    if (goti.position === -1) {
      const path = [];
      let currentPos = player.start - 1; // Start before first move

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

    

    // 3. Moving on main track
    const path = [];
    let currentPos = goti.position;
    const canEnterHome = player.start - currentPos < 12 && player.start - currentPos > 0;
    

    // 2. Already in home lane
    if (canEnterHome) {
      if (currentPos + dice > player.start -1) return null; // Overshot
      const finished = currentPos + dice === player.start -1;
      const homePath = Array.from(
        { length: dice },
        (_, i) => goti.position + i,
      );
      const newPosition = goti.position + dice;
      return { homePath, newPosition, finished, ate: hasOpponent(newPosition) };
    }

    for (let i = 0; i < dice; i++) {
      // If landed on ladder, jump immediately and continue
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
  };

  function handleAnimation(gotiId) {
    // 1. Check if dice is rolled, not animating, and no winner
    if (!game.dice || isRolling || game.winner !== null) return;

    // 2. Find the goti
    const goti = game.gotis.find((g) => g.id === gotiId);
    if (!goti || goti.playerId !== game.currentPlayer || goti.finished) return;

    // 3. Calculate the move
    const move = calculateMove(goti, game.dice);
    if (!move) return; // Invalid move

    // --- DEBUG LOGGING FOR THE MOVE ---
    console.log(`--- Goti Move Analysis ---
    - Goti ID: ${goti.id}
    - Player: ${goti.playerId}
    - Start Position: ${goti.position}
    - Dice Roll: ${game.dice}
    - Calculated Path: [${move?.path?.join(" -> ")}]
    - Final Position: ${move.newPosition}
    --------------------------`);

    // 4. Set up the animation request
    setIsRolling(true);
    setMoveRequest({
      gotiId,
      steps: game.dice, // pass steps for animation speed/logic
      ...move,
    });
  }

  /* ================= COLORS ================= */

  const numberWiseColor = [
    "red",
    "green",
    "orange",
    "blue",
    "yellow",
    "purple",
  ];

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
      POLYGON_SIZE / 1.4,
    );
  }, [playerCount, SVG_SIZE]);

  const lineCoordinates = useMemo(() => {
    return generateLineCordinates(polygonData, playerCount);
  }, [polygonData, playerCount]);

  const boxes = useMemo(() => {
    return generateBoxesFromLineCoordinates(lineCoordinates);
  }, [lineCoordinates]);

  const markers = useMemo(() => {
    const homeLaneMarkers = {};
    // NOTE RE: Goti Path: The following loop prepares for home lane markers.
    // However, for the gotis to be VISIBLE on the home path, the geometry files
    // (e.g., in /src/geometry/) must be updated to provide real coordinates
    // for these special home-lane positions (e.g., position > TOTAL_CELLS).
    // The game logic below correctly handles movement into the home lane, but
    // the goti may seem to disappear or jump because it has no coordinate to render on.
    for (let p = 0; p < playerCount; p++) {
      for (let i = 0; i < HOME_LANE_LENGTH; i++) {
        const pos = TOTAL_CELLS + p * HOME_LANE_LENGTH + i;
        // To fix rendering, you would add coordinates here like so:
        // homeLaneMarkers[pos] = { x: ..., y: ... };
      }
    }
    return { ...generateDropdownMarker(boxes), ...homeLaneMarkers };
  }, [boxes, playerCount, TOTAL_CELLS]);

  // --- DEBUG LOGGING ---
  useEffect(() => {
    console.log("--- BOARD DEBUG INFO ---");
    console.log("Board Markers (Position -> Coordinates):", markers);
    console.log("Player Details (start is base for spawn calc):", PLAYERS);
    console.log("Safe Cells (logical positions):", SAFE_CELLS);
    console.log("------------------------");
  }, [markers, PLAYERS, SAFE_CELLS]);

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

  const starCords = useMemo(() => {
    return generateStarPolygon(boxes, playerCount);
  }, [boxes, playerCount]);

  return (
    <div>
      <svg width={SVG_SIZE} height={SVG_SIZE}>
        <rect
          x="0"
          y="0"
          width={SVG_SIZE}
          height={SVG_SIZE}
          fill="none"
          stroke="black"
          strokeWidth="2"
        />

        <LudoCircle CIRCLE_RADIUS={CIRCLE_RADIUS} SVG_SIZE={SVG_SIZE} />

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
            if (isRolling || game.dice || game.winner !== null) return;

            // roll dice only (no move yet)
            const diceValue = Math.floor(Math.random() * 6) + 1;
            setGame((prev) => ({ ...prev, dice: diceValue }));
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
        />

        {/* --- DEBUG: Show position numbers on board --- */}
        {Object.entries(markers).map(([pos, { x, y }]) => {
          if (pos < TOTAL_CELLS) {
            return (
              <text
                key={`marker-pos-${pos}`}
                x={x}
                y={y}
                fontSize="8"
                fill="black"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ pointerEvents: "none" }}
              >
                {pos}
              </text>
            );
          }
          return null;
        })}

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
          gotis={game.gotis}
          markers={markers}
          homeMarkers={homeMarkers}
          circleCoordinates={circleCoordinates}
          moveRequest={moveRequest}
          onMoveComplete={onMoveComplete}
          numberWiseColor={numberWiseColor}
          playerCount={playerCount}
          currentPlayer={game.currentPlayer}
          handleAnimation={handleAnimation}
        />
      </svg>
    </div>
  );
}

export default LudoBoard;
