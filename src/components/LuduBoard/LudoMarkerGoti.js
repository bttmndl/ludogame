import React from 'react'

function LudoMarkerGoti(props) {
  const {markers, k, toggle, boxRadius, numberWiseColor, chakra} = props;
  return (
    <>
      {/* rendering marker for player move, mrker ->haid,marker,tail*/}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <circle
              key={idx}
              cx={cord.tailCircle[0]}
              cy={cord.tailCircle[1]}
              r={(toggle ? 4 : 0) + boxRadius}
              fill="white"
              stroke={!chakra ? "red" : "black"}
              strokeWidth={toggle ? "5" : "3"}
            />
          )
      )}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <polygon
              key={idx}
              points={cord.headCoordinates}
              fill="white"
              stroke="black"
              strokeWidth="1"
            />
          )
      )}
      {markers?.map(
        (cord, idx) =>
          idx === k && (
            <circle
              key={idx}
              cx={cord.headCircle[0]}
              cy={cord.headCircle[1]}
              r={(toggle ? 4 : 0) + boxRadius}
              fill={numberWiseColor[(Math.floor(idx / 18) + 1) % 6]}
              stroke="black"
              strokeWidth="1"
            />
          )
      )}
    </>
  );
}

export default LudoMarkerGoti