import React, { memo } from 'react'

function LudoPolygon() {
  const playerCount = 6;
  const POLYGON_SIZE = 100;
  const SVG_SIZE = 800;

  const polygonData = generatePolygonCoordinates(
    SVG_SIZE / 2,
    SVG_SIZE / 2,
    playerCount,
    POLYGON_SIZE
  );
  const polygonDataSmall = generatePolygonCoordinates(
    SVG_SIZE / 2,
    SVG_SIZE / 2,
    playerCount,
    POLYGON_SIZE / 1.4
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
  console.log("ludopolygon");
  return (
    <>
      {/* Draw the polygon */}
      <polygon
        points={polygonData?.map(({ x, y }) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />

      {/* Draw the amller polygon */}
      <polygon
        points={polygonDataSmall?.map(({ x, y }) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />
    </>
  );
}

export default memo(LudoPolygon);