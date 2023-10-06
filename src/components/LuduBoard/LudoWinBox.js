import React from 'react'

function LudoWinBox(props) {

  const {winBoxCordLine, numberWiseColor, playerCount} = props;
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

export default LudoWinBox