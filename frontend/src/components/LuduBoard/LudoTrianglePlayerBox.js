import React, { memo } from 'react'

function LudoTrianglePlayerBox({numberWiseColor, triangleCoordsStringArray, circleCoordinates,triangleInnerCordsArray}) {
  
  
  return (
    <>
      {/* Render outer triangles for player House boxes */}
      {triangleCoordsStringArray?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* Render inner triangles for player House boxes */}
      {triangleInnerCordsArray?.map((cord, idx) => (
        <polygon
          key={idx}
          points={cord}
          fill={numberWiseColor[idx]}
          stroke="black"
          strokeWidth="1"
        />
      ))}

      {/* extra just for cover of design*/}
      {circleCoordinates?.map((cord, i) =>
        cord.map(
          (point, idx) =>
            idx === 3 && (
              <circle
                key={idx}
                cx={point[0]}
                cy={point[1]}
                r={30}
                fill="white"
              />
            )
        )
      )}

      
    </>
  );
}

export default memo(LudoTrianglePlayerBox);