import React, { useEffect, useState } from 'react'
import star from "./star.png";

let arrrow = [];
for (let i = 0; i < 3; i++) {
  arrrow.push(0);
}
let arrcol =[];
for (let i = 0; i < 6; i++) {
  arrcol.push(0);
}


let rowanimateIndex;
let colanimateIndex;
export default function One() {
    const [flag, setFlag] = useState(false);
    const [move, setMove] = useState(5);
    const oneStyle = {
        width: '100px',
        boder: '1px solid black',
        backgroundColor: 'grey',
        display:'flex',
        justifyContent:'center',
        flexWrap:'wrap',
    }
    const row ={
        width: '33.3333333px',
        height:'249px',
        border:'0.2px solid black'
    }
    const col = {
        width: "100%",
        height: "42px",
        backgroundColor: "white",
        border: "0.2px solid black",
    };

    const moveJump = (e)=>{
      let idx= e.target.id.split('-');
      rowanimateIndex = Number(idx[1]);
      colanimateIndex = Number(idx[2]);
      setFlag(true);
    }
    useEffect(()=>{
      if(flag){
        setTimeout(()=>{
          if(move!==0){
            setMove(move-1);
            colanimateIndex++;
            console.log(move);
          }else{
            setFlag(false);
          }
        }, 500)
      }
    },[move, flag])
    return (
      <div style={oneStyle}>
        {arrrow.map((elerow, rowidx) => {
          return (
            <div style={row}>
              {arrcol.map((elocol, colidx) => {
                return <div onClick= {moveJump} id={`1-${rowidx}-${colidx}`} style={{ ...col, backgroundColor: (rowidx==1&&colidx!==0)||(rowidx==2&&colidx==1)||(rowidx==rowanimateIndex&&colidx==colanimateIndex)?'green':'white'}}>
                  {((rowidx==2&&colidx==1) ||(rowidx==0&&colidx==2)) && <div><img style={{marginRight:'3px',marginTop:'8px',height:'25px', width:'30px', border:'1px solid black'}} src={star}/></div>}
                </div>;
              })}
            </div>
          );
        })}
      </div>
    );
}
