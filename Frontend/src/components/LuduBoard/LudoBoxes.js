import React, { useMemo, useCallback } from "react";

function LudoBoxes({
  lineCoordinates,
  handleAnimation,
  numberWiseColor,
  playerCount,
}) {
  // Generate boxes from line coordinates for playerMove
  const generateBoxesFromLineCoordinates = useCallback(() => {
    const board = [];
    const boardCellArray = lineCoordinates;

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
          `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`,
        );
      }

      board.push(box);
    }

    return board
      .map((ele, i) => (i % 3 !== 0 ? ele.reverse() : ele))
      .reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []);
  }, [lineCoordinates]);

  // Generate boxes from line coordinates for playerMove
  const boxes = useMemo(() => {
    return generateBoxesFromLineCoordinates();
  }, [generateBoxesFromLineCoordinates]);

  return (
    <>
      {/* main board each cell rendering for goti move*/}
      {boxes.map((box, idx) => (
        <polygon
          key={idx}
          onClick={() => handleAnimation(idx)}
          points={box}
          fill={
            (Math.floor(idx / 6) % 3 === 1 && idx % 6 !== 0) ||
            (Math.floor(idx / 6) % 3 === 2 && idx % 6 === 1)
              ? numberWiseColor[(Math.floor(idx / 18) + 1) % playerCount]
              : "white"
          }
          stroke="black"
          strokeWidth="1"
          style={{ cursor: "pointer" }}
        />
      ))}
    </>
  );
}

export default LudoBoxes;
