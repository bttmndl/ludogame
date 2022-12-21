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

export default function Four() {
  const fourStyle = {
    width: "100px",
    boder: "1px solid black",
    backgroundColor: "grey",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const row = {
    width: "33.333333px",
    height: "249px",
    backgroundColor: "white",
    border: "0.2px solid black",
  };
  const col = {
    width: "100%",
    height: "42px",
    backgroundColor: "white",
    border: "0.2px solid black",
  };
  return (
    <div style={fourStyle}>
      {arrrow.map((elerow, rowidx) => {
        return (
          <div style={row}>
            {arrcol.map((elocol, colidx) => {
              return <div style={{ ...col, backgroundColor: (rowidx==1&&colidx!==5)||(rowidx==0&&colidx==4)?'yellow':'white'}}>
                {((rowidx==2&&colidx==3) ||(rowidx==0&&colidx==4)) && <div><img style={{marginRight:'3px',marginTop:'8px',height:'25px', width:'30px', border:'1px solid black'}} src={star}/></div>}
              </div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
