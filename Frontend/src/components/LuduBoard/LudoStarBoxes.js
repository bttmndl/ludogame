import React, { memo } from 'react'

function LudoStarBoxes({numberWiseColor, playerCount, lineCoordinates}) {
  
  const boxes = generateBoxesFromLineCoordinates();
  const starCords = generateStarPolygon();

  function generateStarPolygon() {
    return boxes
      .filter((_, idx) => idx % 18 === 3)
      .map((cord, idx) => generateCords(cord, idx));

    function generateCords(coordinates, idx) {
      // Split the coordinates string into an array of values
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

      // Destructure the coordinates into individual variables
      const [x1, y1, x2, , x3, y3, , y4] = coordsArray.flat();

      // Calculate the center of the rectangle
      const centerX = (x1 + x3) / 2;
      const centerY = (y1 + y3) / 2;

      // Calculate the width and height of the rectangle
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y4 - y1);

      // Calculate the maximum radius that will fit within the rectangle
      const maxRadius = Math.min(width / 2, height / 2);

      // Define the number of points for the star
      const numPoints = 5;

      // Define the length of the inner and outer points based on maxRadius
      const innerRadius = maxRadius / 2; // Adjust this value for the inner radius
      const outerRadius = maxRadius * outerRange; // Adjust this value for the outer radius

      // Initialize an array to store the polygon points
      const points = [];

      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints; // Angle between points

        // Calculate coordinates for inner and outer points
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const pointX = centerX + radius * Math.cos(angle);
        const pointY = centerY + radius * Math.sin(angle);

        points.push([pointX, pointY]);
      }

      // Convert the points array back to a single string
      const pointsString = points.map((point) => point.join(",")).join(" ");

      return pointsString;
    }
  }
  function generateBoxesFromLineCoordinates() {
    const board = [];
    const boardCellArray = [...lineCoordinates];

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
 
  // function generateTwoMidPointsBetweenTwoPoints(x1, y1, x2, y2) {
  //   // Calculate the direction vector from (x1, y1) to (x2, y2)
  //   const dirX = x2 - x1;
  //   const dirY = y2 - y1;

  //   // Calculate the distance between (x1, y1) and (x2, y2)
  //   const distance = Math.sqrt(dirX * dirX + dirY * dirY);

  //   // Calculate the coordinates of (x3, y3) and (x4, y4) at equal distances from the endpoints
  //   const d = distance / 3; // Divide by 3 to get one-third of the distance

  //   const x3 = x1 + (dirX * d) / distance;
  //   const y3 = y1 + (dirY * d) / distance;

  //   const x4 = x1 + (2 * dirX * d) / distance;
  //   const y4 = y1 + (2 * dirY * d) / distance;

  //   return [x3, y3, x4, y4];
  // }
  console.log("STARCORDS", starCords)
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