import React, { memo } from 'react'

function LudoTrianglePlayerBox(props) {
  const {triangleCoordsStringArray,triangleInnerCordsArray, numberWiseColor, circleCoordinates} = props;
  console.log("triangle");
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

      {/* Render circles for each player House boxes goti*/}
      {circleCoordinates.map((cord, i) =>
        cord.map((point, idx) => (
          <circle
            key={idx}
            cx={point[0]}
            cy={point[1]}
            r={15}
            stroke="black"
            fill={numberWiseColor[i]}
            strokeWidth="3"
          />
        ))
      )}
    </>
  );
}

export default memo(LudoTrianglePlayerBox);