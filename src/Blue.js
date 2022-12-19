import React from 'react'

export default function Blue() {
    const blueStyle = {
      height: "250px",
      width: "250px",
      border: "1px solid red",
      backgroundColor: "blue",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    const blueinline = {
      height: "180px",
      width: "180px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      borderRadius: "20px",
    };
    const bluebutton = {
      height: "50px",
      width: "50px",
      backgroundColor: "blue",
      margin: "20px",
      borderRadius: "30px",
    };
    return (
      <div style={blueStyle}>
        <div style={blueinline}>
          <div style={bluebutton}></div>
          <div style={bluebutton}></div>
          <div style={bluebutton}></div>
          <div style={bluebutton}></div>
        </div>
      </div>
    );
}
