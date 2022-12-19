import React from 'react'

export default function Red() {
    const redStyle = {
      height: "250px",
      width: "250px",
      border: "1px solid red",
      backgroundColor: "red",
      display: "flex",
      justifyContent: "center",
      alignItems:'center'
    };
    const redinline = {
      height: "180px",
      width: "180px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      borderRadius: "20px",
    };
    const redbutton ={
        height:'50px',
        width:'50px',
        backgroundColor:'red',
        margin: '20px',
        borderRadius: '30px'
    }
    return (
      <div style={redStyle}>
        <div style={redinline}>
          <div style={redbutton}></div>
          <div style={redbutton}></div>
          <div style={redbutton}></div>
          <div style={redbutton}></div>
        </div>
      </div>
    );
}
