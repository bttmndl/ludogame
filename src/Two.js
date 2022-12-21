import React from "react";
import star from "./star.png";
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
              return <div style={{ ...col, backgroundColor: (rowidx==1&&colidx!==0)||(rowidx==0&&colidx==1)?'red':'white'}}>
                {((rowidx==2&&colidx==2) ||(rowidx==0&&colidx==1)) && <div><img style={{marginLeft:'3px',marginTop:'3px',height:'25px', width:'30px', border:'1px solid black'}} src={star}/></div>}
              </div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
