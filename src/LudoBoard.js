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

// Constants
const POLYGON_SIZE = 100;

function LudoBoard({ playerCount, SVG_SIZE }) {
  const CIRCLE_RADIUS = SVG_SIZE / 2 - 4;

  /* ================= STATE ================= */

  const [moveRequest, setMoveRequest] = useState(null);
  const [pulseToggle, setPulseToggle] = useState(true);


  function handleAnimation(startIndex) {
    const diceValue = Math.floor(Math.random() * 6) + 1;

    setMoveRequest({
      from: startIndex,
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
    return generateDropdownMarker(boxes, pulseToggle);
  }, [boxes, pulseToggle]);

  const [triangleCoordsArray, triangleCoordsStringArray] = useMemo(() => {
    return generateTriangleCordForPlayerBox(lineCoordinates);
  }, [lineCoordinates]);

  const triangleInnerCordsArray = useMemo(() => {
    return generateInnerTriangleCordForPlayerBox(triangleCoordsArray);
  }, [triangleCoordsArray]);

  const circleCoordinates = useMemo(() => {
    return generateCircleCordForPlayer(triangleCoordsArray);
  }, [triangleCoordsArray]);

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

  console.log("k");

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
          numberWiseColor={numberWiseColor}
          polygonData={polygonData}
          markers={markers}
          playerCount={playerCount}
          moveRequest={moveRequest}
        />
      </svg>
    </div>
  );
}

export default LudoBoard;
