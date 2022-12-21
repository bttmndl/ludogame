import React from "react";
import middle from './middle.jpg';
export default function Middle() {
  const middleStyle = {
    height: "100px",
    width: "100px",
    boder: "0.2px solid black",
    backgroundColor: "grey",
    display:'flex',
    justifyContent:'space-around',
  };

  return (
    <div style={middleStyle}>
      <img src={middle}></img>
    </div>
  );
}
