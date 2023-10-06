import React, { memo } from 'react'

function LudoStarBoxes(props) {
  const {idx,cord,playerCount, numberWiseColor} =props;
  console.log("star");
  return (
    <polygon
      points={cord}
      fill={numberWiseColor[(idx + 1) % playerCount]}
      stroke={numberWiseColor[(idx + 1) % playerCount]}
      strokeWidth="2"
    />
  );
}

export default memo(LudoStarBoxes);