import React, { memo } from 'react'

function LudoCircle({ CIRCLE_RADIUS, SVG_SIZE }) {
  console.log("Circle");
  return (
    <circle
      cx={SVG_SIZE / 2}
      cy={SVG_SIZE / 2}
      r={CIRCLE_RADIUS}
      fill="none"
      stroke="blue"
      strokeWidth="2"
    />
  );
}

export default memo(LudoCircle);