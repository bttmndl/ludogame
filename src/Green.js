import React from 'react'

function Green() {
    const greenStyle = {
      height: "250px",
      width: "250px",
      border: "1px solid red",
      backgroundColor: "green",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };
    const greeninline = {
      height: "180px",
      width: "180px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
      borderRadius: "20px",
    };
    const greenbutton = {
      height: "50px",
      width: "50px",
      backgroundColor: "green",
      margin: "20px",
      borderRadius: "30px",
    };
    return (
      <div style={greenStyle}>
        <div style={greeninline}>
          <div style={greenbutton}></div>
          <div style={greenbutton}></div>
          <div style={greenbutton}></div>
          <div style={greenbutton}></div>
        </div>
      </div>
    );
}

export default Green