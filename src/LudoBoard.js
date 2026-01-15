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
const POLYGON_SIZE = 100;

/* ================= DYNAMIC HELPERS ================= */

function generatePlayers(playerCount, totalCells) {
  const step = totalCells / playerCount; // 18
  return Array.from({ length: playerCount }, (_, i) => ({
    id: i,
    start: i * step,
  }));
}

function generateSafeCells(players, totalCells) {
  return players.map((p) => (p.start + 3) % totalCells);
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

  const PLAYERS = useMemo(
    () => generatePlayers(playerCount, TOTAL_CELLS),
    [playerCount, TOTAL_CELLS]
  );

  const SAFE_CELLS = useMemo(
    () => generateSafeCells(PLAYERS, TOTAL_CELLS),
    [PLAYERS, TOTAL_CELLS]
  );

  /* ---------- GAME STATE ---------- */

  const [game, setGame] = useState(() => ({
    currentPlayer: 0,
    dice: null,
    gotis: createInitialGotis(PLAYERS),
    winner: null,
  }));

  const [moveRequest, setMoveRequest] = useState(null);

  function onMoveComplete(gotiId, finalBox) {
    setGame((prev) => {
      let gotis = [...prev.gotis];

      // 1️⃣ Move the goti
      gotis = gotis.map((g) =>
        g.id === gotiId ? { ...g, position: finalBox } : g
      );

      // 2️⃣ Check EAT (only if not safe cell)
      const isSafe = SAFE_CELLS.includes(finalBox);

      if (!isSafe) {
        gotis = gotis.map((g) => {
          if (
            g.position === finalBox &&
            g.id !== gotiId &&
            g.playerId !== prev.currentPlayer
          ) {
            // eaten → go home
            return { ...g, position: -1 };
          }
          return g;
        });
      }

      // 3️⃣ Change turn (unless dice was 6)
      const nextPlayer =
        prev.dice === 6
          ? prev.currentPlayer
          : (prev.currentPlayer + 1) % PLAYERS.length;

      return {
        ...prev,
        gotis,
        dice: null,
        currentPlayer: nextPlayer,
      };
    });

    // 4️⃣ Clear move request
    setMoveRequest(null);
  }

  function handleAnimation(gotiId) {
    const diceValue = Math.floor(Math.random() * 6) + 1;

    setGame((prev) => ({
      ...prev,
      dice: diceValue,
    }));

    setMoveRequest({
      gotiId,
      steps: diceValue,
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
        POLYGON_SIZE
      ),
    [SVG_SIZE, playerCount]
  );

  const polygonDataSmall = useMemo(() => {
    return generatePolygonCordinates(
      SVG_SIZE / 2,
      SVG_SIZE / 2,
      playerCount,
      POLYGON_SIZE / 1.4
    );
  }, [playerCount]);

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

  const starCords = useMemo(() => {
    return generateStarPolygon(boxes, playerCount);
  }, [boxes, playerCount]);

  const { x: x1, y: y1 } = polygonData[0];
  const { x: x2, y: y2 } = polygonData[1];
  const boxRadius =
    Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 3;

  console.log(homeMarkers)

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

        <text
          x={SVG_SIZE / 2 - (playerCount < 10 ? 30 : 60)}
          y={SVG_SIZE / 2 + 40}
          fill="black"
          style={{ fontFamily: "Arial", fontSize: "100px" }}
        >
          {playerCount}
        </text>

        <LudoBoxes
          lineCoordinates={lineCoordinates}
          handleAnimation={handleAnimation}
          numberWiseColor={numberWiseColor}
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
          gotis={game.gotis}
          markers={markers}
          homeMarkers={homeMarkers}
          circleCoordinates={circleCoordinates}
          moveRequest={moveRequest}
          onMoveComplete={onMoveComplete}
          numberWiseColor={numberWiseColor}
          playerCount={playerCount}
        />
      </svg>
    </div>
  );
}

export default LudoBoard;