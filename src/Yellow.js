import React from 'react'

export default function Yellow() {
    const yellowStyle = {
      height: "250px",
      width: "250px",
      border: "1px solid red",
      backgroundColor: "yellow",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    const yellowinline = {
      height: "180px",
      width: "180px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      borderRadius: "20px",
    };
    const yellowbutton = {
      height: "50px",
      width: "50px",
      backgroundColor: "yellow",
      margin: "20px",
      borderRadius: "30px",
    };
    return (
      <div style={yellowStyle}>
        <div style={yellowinline}>
          <div style={yellowbutton}></div>
          <div style={yellowbutton}></div>
          <div style={yellowbutton}></div>
          <div style={yellowbutton}></div>
        </div>
      </div>
    );
}
