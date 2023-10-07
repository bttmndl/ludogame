import React, { memo, useMemo, useState } from 'react'

function LudoTrianglePlayerBox() {
  const playerCount = 6;
  const POLYGON_SIZE = 100;
  const SVG_SIZE = 800;
  const numberWiseColor = [
    "red",
    "green",
    "orange",
    "blue",
    "yellow",
    "purple",
  ];
  
  const polygonData= generatePolygonCoordinates(
    SVG_SIZE / 2,
    SVG_SIZE / 2,
    playerCount,
    POLYGON_SIZE
  );
  

  const lineCoordinates = generateLineCorinates(playerCount, polygonData);

  const [triangleCoordsArray, triangleCoordsStringArray] = generateTriangleCordForPlayerBox();

  const circleCoordinates = generateCircleCordForPlayer();

  const triangleInnerCordsArray = generateInnerTriangleCordForPlayerBox();

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
  function generateTriangleCordForPlayerBox() {
    const resultCordinatesString = [];
    const resultCordinatesArray = [];
    const cord = lineCoordinates.filter((_, i) => i % 4 === 0 || i % 4 === 1);

    for (let idx = 0; idx < cord.length; idx += 2) {
      const [p1, p2] = cord[idx][0];
      const [q1, q2] = cord[idx][6];
      const [r1, r2] = cord[(idx + 1) % cord.length][6];

      const point = `${p1},${p2} ${q1},${q2} ${r1},${r2}`;
      resultCordinatesArray.push([
        [p1, p2],
        [q1, q2],
        [r1, r2],
      ]);
      resultCordinatesString.push(point);
    }

    return [resultCordinatesArray, resultCordinatesString];
  }
  function generateCircleCordForPlayer() {
    return triangleCoordsArray.map((cord) => {
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
  function generateInnerTriangleCordForPlayerBox() {
    return triangleCoordsArray.map((cord) => {
      return calculateInnerEquilateralTriangle(cord);
    });

    function calculateInnerEquilateralTriangle(vertices) {
      const center = calculateCenter(vertices);
      const len = 27;
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

      return `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`;
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
  

  console.log("triangle");
  return (
    <>
      {/* Render outer triangles for player House boxes */}
      {triangleCoordsStringArray?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* Render inner triangles for player House boxes */}
      {triangleInnerCordsArray?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill={numberWiseColor[idx]}
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* extra just for cover of design*/}
      {circleCoordinates?.map((cord, i) =>
        cord.map(
          (point, idx) =>
            idx === 3 && (
              <circle
                key={idx}
                cx={point[0]}
                cy={point[1]}
                r={30}
                fill="white"
              />
            )
        )
      )}

      {/* Render circles for each player House boxes goti*/}
      {circleCoordinates.map((cord, i) =>
        cord.map((point, idx) => (
          <circle
            key={idx}
            cx={point[0]}
            cy={point[1]}
            r={15}
            stroke="black"
            fill={numberWiseColor[i]}
            strokeWidth="3"
          />
        ))
      )}
    </>
  );
}

export default memo(LudoTrianglePlayerBox);