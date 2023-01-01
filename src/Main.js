import React from "react";
import TriangleSVG from "./TriangleSVG";
const styleMain = {
  height: "700px",
  width: "700px",
  marginTop:'0 auto',
  border: "5px solid black",
};


export default function Main() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={styleMain}>
        <TriangleSVG />
      </div>
    </div>
  );
}
