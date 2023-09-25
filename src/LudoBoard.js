import React, { useState } from "react";

// Constants
const SVG_SIZE = 800;
const CIRCLE_RADIUS = SVG_SIZE / 2 - 4;
const POLYGON_SIZE = 100;

function LudoBoard({ playerCount }) {
  const [k] = useState(0);
  // useEffect(()=>{
  //   const kk = setInterval(()=>{sk(p=>(p+1)%(playerCount*18))},[30]);
  //   return ()=> clearInterval(kk);
  // },[k])

  // inner BoardOutline generation of polygon
  const polygonData = generatePolygonCoordinates(
    SVG_SIZE / 2,
    SVG_SIZE / 2,
    playerCount,
    POLYGON_SIZE
  );

  function generatePolygonCoordinates(cx, cy, sides, size) {
    const coordinates = [];

    // Calculate the coordinates for the board cells from polygon vertices with the help of circle

    const angleIncrement = (2 * Math.PI) / sides;

    //main polygon points
    const x = cx + size * Math.cos(0);
    const y = cy + size * Math.sin(0);
    coordinates.push({ x, y });
    
    for (let i = 1; i < sides; i++) {
      const x = cx + size * Math.cos(i * angleIncrement);
      const y = cy + size * Math.sin(i * angleIncrement);

      const [m1, n1, m2, n2] = generateTwoMidPointsBetweenTwoPoints(
        coordinates[coordinates.length - 1].x,
        coordinates[coordinates.length - 1].y,
        x,
        y
      );
      coordinates.push({ x: m1, y: n1 }, { x: m2, y: n2 });

      coordinates.push({ x, y });
    }
    const [m1, n1, m2, n2] = generateTwoMidPointsBetweenTwoPoints(
      coordinates[coordinates.length - 1].x,
      coordinates[coordinates.length - 1].y,
      coordinates[0].x,
      coordinates[0].y
    );
    coordinates.push({ x: m1, y: n1 }, { x: m2, y: n2 });

    return coordinates;
  }

  //generating eachline cordinate
  function generateLineCorinates() {
    const corner = [];
    const side = [];
    const rot = playerCount / 2 - 1;
    const cord = [];

    for (let i = 0; i < polygonData.length; i++) {
      if (i % 3 === 0) {
        const { x: x1, y: y1 } = polygonData[i];
        const { x: x3, y: y3 } = polygonData[determineIndex(i)];
        const { x: x4, y: y4 } = polygonData[cornerIndex(i)];

        const [frontCord] = calculateLinePoints(x1, y1, x3, y3);
        const [cornerFrontCord] = calculateLinePoints(x1, y1, x4, y4);

        corner.push(frontCord, cornerFrontCord);
      } else {
        const { x: x1, y: y1 } = polygonData[i];
        const { x: x3, y: y3 } = polygonData[determineIndex(i)];
        const [frontCord] = calculateLinePoints(x1, y1, x3, y3);

        side.push(frontCord);
      }
    }

    for (let i = 0; i < corner.length; i += 2) {
      cord.push(
        corner[i],
        corner[(i + 1) % corner.length],
        side[i],
        side[(i + 1) % corner.length]
      );
    }

    function calculateLinePoints(x1, y1, x3, y3) {
      const frontCord = [[x1, y1]];
      const backCord = [[x3, y3]];

      for (let j = 1; j <= 6; j++) {
        const p = extendLine(x1, y1, x3, y3, 50 * j);

        frontCord.push([p[0], p[1]]);
        backCord.push([p[2], p[3]]);
      }
      return [frontCord, backCord];
    }

    function determineIndex(i) {
      const cornerPointIdx = (i + 3 * rot) % polygonData.length;
      const midPointFirst = (i + 4 + 3 * rot) % polygonData.length;
      const midPointSecond = (i + 2 + 3 * rot) % polygonData.length;

      return i % 3 === 0
        ? cornerPointIdx
        : i % 3 === 1
        ? midPointFirst
        : midPointSecond;
    }

    function cornerIndex(i) {
      return (i + 3 * (rot + 2)) % polygonData.length;
    }

    function extendLine(x1, y1, x2, y2, extensionLength) {
      // Calculate the direction vector of the line
      const dx = x2 - x1;
      const dy = y2 - y1;

      // Calculate the length of the direction vector
      const length = Math.sqrt(dx * dx + dy * dy);

      // Normalize the direction vector
      const normalizedDx = dx / length;
      const normalizedDy = dy / length;

      // Extend the line in both directions

      const X1 = x1 - extensionLength * normalizedDx;
      const Y1 = y1 - extensionLength * normalizedDy;

      const X2 = x2 + extensionLength * normalizedDx;
      const Y2 = y2 + extensionLength * normalizedDy;

      return [X1, Y1, X2, Y2];
    }

    return cord;
  }

  // Generate boxes from line coordinates for playerMove
  function generateBoxesFromLineCoordinates() {
    const board = [];
    const boardCellArray = generateLineCorinates();

    for (let i = 0; i < boardCellArray.length; i++) {
      if (i % 4 === 0) continue;
      const box = [];
      for (let j = 0; j < boardCellArray[i].length - 1; j++) {
        const p1 = [boardCellArray[i][j][0], boardCellArray[i][j][1]];
        const p2 = [
          boardCellArray[(i + 1) % boardCellArray.length][j][0],
          boardCellArray[(i + 1) % boardCellArray.length][j][1],
        ];
        const p3 = [
          boardCellArray[(i + 1) % boardCellArray.length][j + 1][0],
          boardCellArray[(i + 1) % boardCellArray.length][j + 1][1],
        ];
        const p4 = [boardCellArray[i][j + 1][0], boardCellArray[i][j + 1][1]];

        box.push(
          `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`
        );
      }

      board.push(box);
    }

    //rearranging the array for right direction
    return board
      .map((ele, i) => (i % 3 !== 0 ? ele.reverse() : ele))
      .reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []);
  }

  // Generate midpoints between two points
  function generateTwoMidPointsBetweenTwoPoints(x1, y1, x2, y2) {
    // Calculate the direction vector from (x1, y1) to (x2, y2)
    const dirX = x2 - x1;
    const dirY = y2 - y1;

    // Calculate the distance between (x1, y1) and (x2, y2)
    const distance = Math.sqrt(dirX * dirX + dirY * dirY);

    // Calculate the coordinates of (x3, y3) and (x4, y4) at equal distances from the endpoints
    const d = distance / 3; // Divide by 3 to get one-third of the distance

    const x3 = x1 + (dirX * d) / distance;
    const y3 = y1 + (dirY * d) / distance;

    const x4 = x1 + (2 * dirX * d) / distance;
    const y4 = y1 + (2 * dirY * d) / distance;

    return [x3, y3, x4, y4];
  }

  //Extracting triangle structucture point for each player Box area
  function generateTriangleCordForPlayerBox() {
    const resultCordinatesString = [];
    const resultCordinatesArray = [];
    const cord = generateLineCorinates().filter(
      (_, i) => i % 4 === 0 || i % 4 === 1
    );

    for (let idx = 0; idx < cord.length; idx += 2) {
      const point = `
          ${cord[idx][0][0]},${cord[idx][0][1]} 
          ${cord[idx][6][0]},${cord[idx][6][1]} ${cord[(idx + 1) % cord.length][6][0]},${cord[(idx + 1) % cord.length][6][1]}
        `;
      resultCordinatesArray.push([[...cord[idx][0]], [...cord[idx][6]], [...cord[(idx + 1) % cord.length][6]]]);
      resultCordinatesString.push(point);
    }

    return [resultCordinatesArray, resultCordinatesString];
  }

  //Extracting circle codinates from Triangle cordinates, returning array
  function generateCircleCordForPlayer() {
    const cordinateArray = generateTriangleCordForPlayerBox()[0];

    return cordinateArray.map((cord) => {
      return calculateInnerEquilateralTriangle(cord);
    });

    function calculateInnerEquilateralTriangle(vertices) {
      const center = calculateCenter(vertices);

      // Calculate the coordinates of the midpoints between the center and the vertices
      const p1 = [
        (vertices[0][0] + center[0]) / 2,
        (vertices[0][1] + center[1]) / 2,
      ];

      const p2 = [
        (vertices[1][0] + center[0]) / 2,
        (vertices[1][1] + center[1]) / 2,
      ];

      const p3 = [
        (vertices[2][0] + center[0]) / 2,
        (vertices[2][1] + center[1]) / 2,
      ];

      return [p1, p2, p3, center];
    }

    function calculateCenter(vertices) {
      // Calculate the average x and y coordinates of the vertices
      const sumX = vertices.reduce((sum, vertex) => sum + vertex[0], 0);
      const sumY = vertices.reduce((sum, vertex) => sum + vertex[1], 0);
      const centerX = sumX / vertices.length;
      const centerY = sumY / vertices.length;
      return [centerX, centerY];
    }

  }
  console.log("lc", generateCircleCordForPlayer());

  return (
    <div>
      <svg width={SVG_SIZE} height={SVG_SIZE}>
        {/* Draw the square */}
        <rect
          x="0"
          y="0"
          width={SVG_SIZE}
          height={SVG_SIZE}
          fill="none"
          stroke="black" // Outline color
          strokeWidth="2" // Outline width
        />
        {/* Draw the circle */}
        <circle
          cx={SVG_SIZE / 2}
          cy={SVG_SIZE / 2}
          r={CIRCLE_RADIUS}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />

        <text
          x={SVG_SIZE / 2 - 30}
          y={SVG_SIZE / 2 + 40}
          fill="black"
          style={{ fontFamily: "Arial", fontSize: "100px" }}
        >
          {playerCount}
        </text>

        {/* main board each cell rendering for goti move*/}
        {generateBoxesFromLineCoordinates().map((box, idx) => (
          <polygon
            key={idx}
            points={box}
            fill={idx === k ? "red" : "none"}
            stroke="red"
            strokeWidth="1"
          />
        ))}

        {generateLineCorinates().map((e, idx) => (
          <circle
            key={idx}
            cx={e[1][0]}
            cy={e[1][1]}
            r={5}
            fill={idx === k && "red"}
          />
        ))}

        {/* Draw the polygon */}
        <polygon
          points={polygonData.map(({ x, y }) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="green"
          strokeWidth="2"
        />

        {/* Render triangles for player House boxes */}
        {generateTriangleCordForPlayerBox()[1].map((cord, idx) => (
          <polygon
            key={idx}
            points={cord}
            fill="green"
            stroke="black"
            strokeWidth="1"
          />
        ))}

        {/* Render circles for each player House boxes goti*/}
        {generateCircleCordForPlayer().map((cord, idx) => (
          cord.map((point, idx)=><circle key={idx} cx={point[0]} cy={point[1]} r={20} fill="red" />)
        ))}

      </svg>
    </div>
  );
}

export default LudoBoard;
