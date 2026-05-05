import React, { memo, useMemo } from "react";

function generateStarPolygon(boxes, playerCount) {
  return boxes
    .filter((_, idx) => idx % 18 === 3)
    .map((cord, idx) => generateStarPoints(cord, idx, playerCount));
}

function generateStarPoints(coordinates, idx, playerCount) {
  const coordsArray = coordinates
    .split(" ")
    .map((coord) => coord.split(",").map(parseFloat));

  const outerRange =
    idx === 0 ||
    idx === playerCount / 2 ||
    idx === playerCount / 2 - 1 ||
    idx === playerCount - 1
      ? 2 * playerCount * 0.16
      : 1;

  const [x1, y1, x2, , x3, y3, , y4] = coordsArray.flat();
  const centerX = (x1 + x3) / 2;
  const centerY = (y1 + y3) / 2;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y4 - y1);
  const maxRadius = Math.min(width / 2, height / 2);
  const numPoints = 5;
  const innerRadius = maxRadius / 2;
  const outerRadius = maxRadius * outerRange;
  const points = [];

  for (let i = 0; i < numPoints * 2; i++) {
    const angle = (i * Math.PI) / numPoints;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push([
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle),
    ]);
  }

  return points.map((point) => point.join(",")).join(" ");
}

function LudoStarBoxes({ numberWiseColor, playerCount, boxes = [] }) {
  const starCords = useMemo(
    () => generateStarPolygon(boxes, playerCount),
    [boxes, playerCount],
  );

  return (
    <>
      {starCords?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill={numberWiseColor[(idx + 1) % playerCount]}
          stroke={numberWiseColor[(idx + 1) % playerCount]}
          strokeWidth="2"
        />
      ))}
    </>
  );
}

export default memo(LudoStarBoxes);
