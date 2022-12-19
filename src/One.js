import React from 'react'


let arrrow = [];
for (let i = 0; i < 3; i++) {
  arrrow.push(0);
}
let arrcol =[];
for (let i = 0; i < 6; i++) {
  arrcol.push(0);
}

export default function One() {
    const oneStyle = {
        height: '250px',
        width: '98.7px',
        boder: '1px solid black',
        backgroundColor: 'grey',
        display:'flex',
        justifyContent:'center',
        flexWrap:'wrap',
    }
    const row ={
        width: '33.3333%',
        height:'250px',
        backgroundColor:'white',
        border:'0.2px solid black'
    }
    const col = {
        width: "100%",
        height: "42px",
        backgroundColor: "white",
        border: "0.2px solid black",
    };
    return (
      <div style={oneStyle}>
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
