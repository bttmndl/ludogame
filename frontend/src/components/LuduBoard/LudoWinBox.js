import React, { memo } from "react";

function LudoWinBox({ winBoxCordLine, numberWiseColor, playerCount }) {

  return (
    <>
      {/* Draw the win box line */}
      {winBoxCordLine?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill={numberWiseColor[(idx + 1) % playerCount]}
          stroke="black"
          strokeWidth="1"
        />
      ))}
    </>
  );
}

export default memo(LudoWinBox);
