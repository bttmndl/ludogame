import React, { memo, useMemo } from 'react'

function LudoMarkerGoti({toggle, k, chakra}) {
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

  const polygonData = useMemo(() => {
    return generatePolygonCoordinates(
      SVG_SIZE / 2,
      SVG_SIZE / 2,
      playerCount,
      POLYGON_SIZE
    );
  }, [playerCount]);
  // Generate line coordinates
  const lineCoordinates = useMemo(() => {
    return generateLineCorinates(playerCount, polygonData);
  }, [playerCount, polygonData]);

  // Generate boxes from line coordinates for playerMove
  const boxes = useMemo(() => {
    return generateBoxesFromLineCoordinates();
  }, [lineCoordinates]);

  //genereting marker points for player move in boxes
  const markers = useMemo(() => {
    return generateDropdownMarker();
  }, [boxes]);


  function generatePolygonCoordinates(cx, cy, sides, size) {
    console.log("generatePolygonCoordinates");
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
    console.log("generateLineCorinates");
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
    console.log("generateBoxesFromLineCoordinates");
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
    console.log("generateTwoMidPointsBetweenTwoPoints");
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
  function generateDropdownMarker() {
    console.log("generateDropdownMarker");
    return boxes.map((cord) => generateCords(cord));

    function generateCords(rectanglePoints) {
      //converting cord from string array of floats
      const point = rectanglePoints
        .split(" ")
        .map((cord) => cord.split(","))
        .flat()
        .map((p) => parseFloat(p));

      const [x1, y1, x2, y2, x3, y3, x4, y4] = point;

      const midX = (x1 + x3) / 2;
      const midY = (y1 + y3) / 2;

      // Define the size and appearance of the pin drop marker
      const headRadius = toggle ? 20.3 : 17.3; // calculating radius based on the width of the rectangle
      const leftShift = toggle ? 55 : 35;
      // Generate the coordinates for the pin head
      const headCoordinates = generateCircleCoordinates(
        midX - leftShift,
        midY,
        headRadius,
        leftShift
      );

      return {
        headCoordinates,
        headCircle: [midX - leftShift, midY],
        tailCircle: [midX, midY],
      };
    }

    function generateCircleCoordinates(centerX, centerY, radius, leftShift) {
      const numPoints = 20; // Number of points to approximate the circle
      const points = [];

      //intial marker starting point
      points.push([centerX + leftShift + 4, centerY]);

      for (let i = 0; i < numPoints; i++) {
        if (i >= 4 && i <= 16) {
          const angle = (i * Math.PI * 2) / numPoints;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          points.push([x, y]);
        }
      }
      points.push([centerX + leftShift + 4, centerY]);

      // Convert the points array back to a single string
      const coordinates = points.map((point) => point.join(",")).join(" ");

      return coordinates;
    }
  }

  const { x: x1, y: y1 } = polygonData[0];
  const { x: x2, y: y2 } = polygonData[1];
  const boxRadius =
    Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 3;
  console.log("LudoMarkerGoti");
  return (
    <>
      {/* rendering marker for player move, mrker ->haid,marker,tail*/}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <circle
              key={idx}
              cx={cord.tailCircle[0]}
              cy={cord.tailCircle[1]}
              r={(toggle ? 4 : 0) + boxRadius}
              fill="white"
              stroke={!chakra ? "red" : "black"}
              strokeWidth={toggle ? "5" : "3"}
            />
          )
      )}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <polygon
              key={idx}
              points={cord.headCoordinates}
              fill="white"
              stroke="black"
              strokeWidth="1"
            />
          )
      )}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <circle
              key={idx}
              cx={cord.headCircle[0]}
              cy={cord.headCircle[1]}
              r={(toggle ? 4 : 0) + boxRadius}
              fill={numberWiseColor[(Math.floor(idx / 18) + 1) % 6]}
              stroke="black"
              strokeWidth="1"
            />
          )
      )}
    </>
  );
}

export default memo(LudoMarkerGoti);