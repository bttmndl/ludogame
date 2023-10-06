import React from 'react'

function LudoCircle({ CIRCLE_RADIUS, SVG_SIZE }) {
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

export default LudoCircle