import React from "react";

function LudoBoard({ playerCount }) {
  const svgSize = 800;
  const circleRadius = svgSize / 2 - 20; // Radius is half of the SVG size minus 20 for padding
  const polygonSize = 80; // Size of the polygon

  // inner BoardOutline 
  const polygonData = generatePolygonCoordinates(
    svgSize / 2,
    svgSize / 2,
    playerCount,
    polygonSize
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

      const [m1, n1, m2, n2] = generateTwoMidPointsBetweenTwoPoints(coordinates[coordinates.length-1].x,coordinates[coordinates.length-1].y,x,y);
      coordinates.push({x:m1,y:n1}, {x:m2,y:n2});

      coordinates.push({ x, y });
    }
    const [m1, n1, m2, n2] = generateTwoMidPointsBetweenTwoPoints(coordinates[coordinates.length-1].x,coordinates[coordinates.length-1].y,coordinates[0].x,coordinates[0].y);
    coordinates.push({ x: m1, y: n1 }, { x: m2, y: n2 });
    
    return coordinates;
  }

  //temprorery render
  const lines = [];
  function generateLineCorinates() {
    const linesCordinates = [];
    const rot = Math.ceil(playerCount/3)
    for (let i = 0; i < polygonData.length; i++) {
      const { x: x1, y: y1 } = polygonData[i];
      
    //   const cornerPointIdx =(i + 2 + (playerCount - 6) / 2) % polygonData.length;
      const cornerPointIdx =(i+(3*rot)) % polygonData.length;
      const midPointFirst = (i+4 + (3*rot)) % polygonData.length;
      const midPointSecond = (i + 2 + (3*rot)) % polygonData.length;
      const { x: x3, y: y3 } = i%3===0 ? polygonData[cornerPointIdx]: i%3===1 ? polygonData[midPointFirst] : polygonData[midPointSecond];

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
      )
    }
    return linesCordinates;
  };

  //individual total BoardCell coordinates
  const rectangles = []; // temp render
  const boardCellArraycord = generateBoardCellArrayCoordinates();
  function generateBoardCellArrayCoordinates() {
    const box = [];

    generateLineCorinates().forEach((cord, idx) => {
      const frontCord = [[cord[0], cord[1]]];
      const backCord = [[cord[2], cord[3]]];

      for (let i = 1; i < 6; i++) {
        const p = extendLine(cord[0], cord[1], cord[2], cord[3], 50 * i);

        frontCord.push([p[0], p[1]]);
        backCord.push([p[2], p[3]]);
      }

      box.push(frontCord, backCord);
    });
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
    return box;
  };
  //rendering
  boardCellArraycord.forEach((p) => {
    rectangles.push(
      <line
        x1={p[0][0]}
        y1={p[0][1]}
        x2={p[5][0]}
        y2={p[5][1]}
        stroke="black" // Line color
        strokeWidth="2" // Line width
      />
    );
  });


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


  console.log("polygonData", polygonData);
  console.log("boardCellArraycord", boardCellArraycord)
  //[494.64, 454.64, 425.36, 414.64]
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
        {polygonData.map(({x,y},idx)=>(
            <circle cx={x} cy={y} r={5} fill={idx===12 ? "red":"black"}/>
        ))}
        {/* Draw the polygon */}
        <polygon
          points={polygonData.map(({ x, y }) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="green" 
          strokeWidth="2"
        />

        {/* Draw lines from polygon vertices to the circle */}
        {lines}
        {rectangles}
      </svg>
    </div>
  );
}

export default LudoBoard;
