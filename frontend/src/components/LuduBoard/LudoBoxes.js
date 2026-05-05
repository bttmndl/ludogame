import React, { memo } from "react";

function LudoBoxes({
  boxes = [],
  numberWiseColor,
  playerCount,
}) {
  return (
    <>
      {/* main board each cell rendering for goti move*/}
      {boxes.map((box, idx) => (
        <polygon
          key={idx}
          points={box}
          fill={
            (Math.floor(idx / 6) % 3 === 1 && idx % 6 !== 0) ||
            (Math.floor(idx / 6) % 3 === 2 && idx % 6 === 1)
              ? numberWiseColor[(Math.floor(idx / 18) + 1) % playerCount]
              : "white"
          }
          stroke="black"
          strokeWidth="1"
        />
      ))}
    </>
  );
}

export default memo(LudoBoxes);
