import React, { useEffect, useState } from "react";

function LudoBoard({ playerCount }) {
  const [k,sk]=useState(0);
//   useEffect(()=>{
//     const kk = setInterval(()=>{sk(p=>p+1)},[500]);
//     return ()=> clearInterval(kk);
//   },[k])
  const svgSize = 800;
  const circleRadius = svgSize / 2 - 4; // Radius is half of the SVG size minus 20 for padding
  const polygonSize = 100; // Size of the polygon

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

  function generateLineCorinates() {
    const corner = [];
    const side = [];
    const rot = Math.ceil(playerCount/3);
    const cord = [];

    for (let i = 0; i < polygonData.length; i++) {
      
      if(i%3===0) {
        const { x: x1, y: y1 } = polygonData[i];
        const { x: x3, y: y3 } = polygonData[determineIndex(i)];
        const { x: x4, y: y4 } = polygonData[cornerIndex(i)];

        const [frontCord] = calculateLinePoints(x1,y1,x3,y3);
        const [cornerFrontCord] = calculateLinePoints(x1,y1,x4,y4);

        corner.push(frontCord, cornerFrontCord);
      }else{
        const { x: x1, y: y1 } = polygonData[i];
        const { x: x3, y: y3 } = polygonData[determineIndex(i)];
        const [frontCord] = calculateLinePoints(x1,y1,x3,y3);

        side.push(frontCord);
      }
    }

    for (let i = 0; i < corner.length; i+=2) {
      cord.push(
        corner[i],
        corner[(i + 1) % corner.length],
        side[i],
        side[(i + 1) % corner.length]
      );
    }

    function calculateLinePoints(x1,y1,x3,y3){
        const frontCord = [[x1, y1]];
        const backCord = [[x3, y3]];

        for (let j = 1; j <= 6; j++) {
          const p = extendLine(x1, y1, x3, y3, 50 * j);

          frontCord.push([p[0], p[1]]);
          backCord.push([p[2], p[3]]);
        }
        return [frontCord, backCord];
    }

    function determineIndex(i){
        const cornerPointIdx = (i + 3 * rot) % polygonData.length;
        const midPointFirst = (i + 4 + 3 * rot) % polygonData.length;
        const midPointSecond = (i + 2 + 3 * rot) % polygonData.length;

        return i%3===0 ? cornerPointIdx: i%3===1 ? midPointFirst :midPointSecond;
    }

    function cornerIndex(i){
        return (i+playerCount*rot) % polygonData.length;
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
  };


  function lineToBox() {
  const board = [];
  const boardCellArray = generateLineCorinates();

  for (let i = 0; i < boardCellArray.length; i++) {
    if(i%4===0) continue;
    const box = [];
    for (let j = 0; j < boardCellArray[i].length-1; j++) {
      const p1 = [boardCellArray[i][j][0], boardCellArray[i][j][1]];
      const p2 = [boardCellArray[(i + 1) % boardCellArray.length][j][0], boardCellArray[(i + 1) % boardCellArray.length][j][1]];
      const p3 = [boardCellArray[(i + 1) % boardCellArray.length][j + 1][0], boardCellArray[(i + 1) % boardCellArray.length][j + 1][1]];
      const p4 = [boardCellArray[i][j + 1][0], boardCellArray[i][j + 1][1]];

      box.push(`${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`);
    }
    board.push(box);
  }

  return board;
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
  console.log("lc",generateLineCorinates());
  //console.log(polygonData)
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
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={circleRadius}
          fill="none"
          stroke="blue"
          strokeWidth="2"
        />

        {lineToBox().slice(k,k+22).map((p, idx) => (
          <polygon 
                points={p}
                fill="none"
                stroke="red"
                strokeWidth="1"
            />
        ))}


        {generateLineCorinates().map((e, idx) => (
          <circle cx={e[2][0]} cy={e[2][1]} r={5} fill={idx === 0 && "red"} />
        ))}

        {/* Draw the polygon */}
        <polygon
          points={polygonData.map(({ x, y }) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="green"
          strokeWidth="2"
        />

        {/* {rectangles} */}
      </svg>
    </div>
  );
}

export default LudoBoard;
