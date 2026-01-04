import React, { memo, useEffect, useMemo, useState } from "react";

function LudoMarkerGoti({numberWiseColor, polygonData, markers, playerCount}) {
  

  const [currentBox, setCurrentBox] = useState(45);
  const [destination, setDestination] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [chakra, setChakra] = useState(false);

  let markerGotiAnimation = null;
  let chakraAnimation = null;
  let zumpAnimation = null;
  useEffect(() => {
    if (currentBox) {
      clearInterval(markerGotiAnimation);

      if (currentBox === destination) setCurrentBox(null);

      markerGotiAnimation = setInterval(() => {
        setCurrentBox((p) => (p + 1) % (playerCount * 18));
        setToggle((p) => !p);
      }, [300]);
    } else {
      clearInterval(markerGotiAnimation);
    }
    return () => clearInterval(markerGotiAnimation);
  }, [currentBox]);

  useEffect(() => {
    if (toggle) {
      chakraAnimation = setInterval(() => {
        setChakra((p) => !p);
      }, 50);
    }
    zumpAnimation = setInterval(() => {
      setToggle((p) => !p);
    }, 2000);
    return () => {
      clearInterval(zumpAnimation);
      clearInterval(chakraAnimation);
    };
  }, [toggle]);


  const { x: x1, y: y1 } = polygonData[0];
  const { x: x2, y: y2 } = polygonData[1];
  const boxRadius =
    Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) / 3;
  console.log("LudoMarkerGoti");
  return (
    <>
      {/* rendering marker for player move, mrker ->haid,marker,tail*/}
      {markers?.map(
        (cord, idx) =>
          idx === currentBox && (
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
          idx === currentBox && (
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
          idx === currentBox && (
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

export default memo(LudoMarkerGoti);
