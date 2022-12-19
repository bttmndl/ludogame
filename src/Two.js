import React from "react";

let arrrow = [];
for (let i = 0; i < 3; i++) {
  arrrow.push(0);
}
let arrcol = [];
for (let i = 0; i < 6; i++) {
  arrcol.push(0);
}

export default function Two() {
  const twoStyle = {
    height: "100px",
    width: "250px",
    boder: "1px solid black",
    backgroundColor: "grey",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const row = {
    width: "100%",
    height: "33px",
    backgroundColor: "white",
    border: "0.2px solid black",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  };
  const col = {
    width: "16.666666667%",
    height: "42px",
    backgroundColor: "white",
    border: "0.2px solid black",
  };
  return (
    <div style={twoStyle}>
      {arrrow.map((elerow, rowidx) => {
        return (
          <div style={row}>
            {arrcol.map((elocol, colidx) => {
              return <div style={col}></div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
