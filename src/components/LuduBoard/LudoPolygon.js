import React from 'react'

function LudoPolygon(props) {
  const {polygonData, polygonDataSmall} = props;

  return (
    <>
      {/* Draw the polygon */}
      <polygon
        points={polygonData?.map(({ x, y }) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />

      {/* Draw the amller polygon */}
      <polygon
        points={polygonDataSmall?.map(({ x, y }) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />
    </>
  );
}

export default LudoPolygon