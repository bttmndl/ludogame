import React, { memo, useMemo } from "react";

function LudoPolygon({ polygonData, polygonDataSmall }) {
  const polygonPoints = useMemo(
    () => polygonData?.map(({ x, y }) => `${x},${y}`).join(" "),
    [polygonData],
  );
  const smallPolygonPoints = useMemo(
    () => polygonDataSmall?.map(({ x, y }) => `${x},${y}`).join(" "),
    [polygonDataSmall],
  );

  return (
    <>
      {/* Draw the polygon */}
      <polygon
        points={polygonPoints}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />

      {/* Draw the smaller polygon */}
      <polygon
        points={smallPolygonPoints}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />
    </>
  );
}

export default memo(LudoPolygon);
