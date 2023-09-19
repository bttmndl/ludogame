import React from "react";

function LudoBoard({ playerCount }) {
  const svgSize = 800;
  const circleRadius = svgSize / 2 - 20; // Radius is half of the SVG size minus 20 for padding
  const hexagonSize = 80; // Size of the hexagon

  // Calculate the coordinates for the hexagon vertices
  //   const hexagonData = [
  //     {
  //       x: svgSize / 2 + hexagonSize,
  //       y: svgSize / 2,
  //     },
  //     {
  //       x: svgSize / 2 + hexagonSize / 2,
  //       y: svgSize / 2 + (hexagonSize * Math.sqrt(3)) / 2,
  //     },
  //     {
  //       x: svgSize / 2 - hexagonSize / 2,
  //       y: svgSize / 2 + (hexagonSize * Math.sqrt(3)) / 2,
  //     },
  //     {
  //       x: svgSize / 2 - hexagonSize,
  //       y: svgSize / 2,
  //     },
  //     {
  //       x: svgSize / 2 - hexagonSize / 2,
  //       y: svgSize / 2 - (hexagonSize * Math.sqrt(3)) / 2,
  //     },
  //     {
  //       x: svgSize / 2 + hexagonSize / 2,
  //       y: svgSize / 2 - (hexagonSize * Math.sqrt(3)) / 2,
  //     },
  //   ];

  function generatePolygonCoordinates(cx, cy, sides, size) {
    const coordinates = [];
    const angleIncrement = (2 * Math.PI) / sides;

    for (let i = 0; i < sides; i++) {
      const x = cx + size * Math.cos(i * angleIncrement);
      const y = cy + size * Math.sin(i * angleIncrement);
      coordinates.push({ x, y });
    }

    return coordinates;
  }

  const hexagonData = generatePolygonCoordinates(
    svgSize / 2,
    svgSize / 2,
    playerCount,
    hexagonSize
  );

  // Calculate the coordinates for the lines from hexagon vertices to the circle
  const lines = [];
  const linesCordinates = [];
  for (let i = 0; i < hexagonData.length; i++) {
    const { x: x1, y: y1 } = hexagonData[i];
    const { x: x3, y: y3 } =
      hexagonData[(i + 2 + (playerCount - 6) / 2) % hexagonData.length];

    // Calculate the angle from the center of the circle to the vertex
    const angle = Math.atan2(y1 - svgSize / 2, x1 - svgSize / 2);
    // Calculate the intersection point on the circle's circumference
    const x2 = svgSize / 2 + circleRadius * Math.cos(angle);
    const y2 = svgSize / 2 + circleRadius * Math.sin(angle);

    // Calculate the angle from the center of the circle to the second vertex
    const angle2 = Math.atan2(y3 - svgSize / 2, x3 - svgSize / 2);
    // Calculate the intersection point on the circle's circumference
    const x4 = svgSize / 2 + circleRadius * Math.cos(angle2);
    const y4 = svgSize / 2 + circleRadius * Math.sin(angle2);

    linesCordinates.push([x1, y1, x3, y3]);

    lines.push(
      <line
        key={`line-${x1}-${y1}-${x3}-${y3}`}
        x1={x1}
        y1={y1}
        x2={x3}
        y2={y3}
        stroke="red" // Line color
        strokeWidth="1" // Line width
      />
    );
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
  const rectangles = [];
  linesCordinates.forEach((cord) => {
    const box = [];
    for (let i = 1; i <= 6; i++) {
      const p = extendLine(cord[0], cord[1], cord[2], cord[3], 50 * i);
      box.push([p[0], p[1]]);
      box.push([p[2], p[3]]);
      rectangles.push(
        <line
          x1={p[0]}
          y1={p[1]}
          x2={p[2]}
          y2={p[3]}
          stroke="black" // Line color
          strokeWidth="1" // Line width
        />
      );
    }
  });

  return (
    <div>
      <svg width={svgSize} height={svgSize}>
        {/* Draw the square */}
        <rect
          x="0"
          y="0"
          width={svgSize}
          height={svgSize}
          fill="none"
          stroke="black" // Outline color
          strokeWidth="2" // Outline width
        />

        {/* Draw the circle */}
        <circle
          cx={svgSize / 2} // Center X
          cy={svgSize / 2} // Center Y
          r={circleRadius} // Radius
          fill="none"
          stroke="blue" // Circle color
          strokeWidth="2" // Circle outline width
        />

        {/* Draw the hexagon */}
        <polygon
          points={hexagonData.map(({ x, y }) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="green" // Hexagon outline color
          strokeWidth="2" // Hexagon outline width
        />

        {/* Draw lines from hexagon vertices to the circle */}
        {lines}
        {rectangles}
      </svg>
    </div>
  );
}

export default LudoBoard;
