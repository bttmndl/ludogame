import React from "react";

const Dice = () => {

  return (
    <div>
      <svg width="100" height="100">
        <rect x="10" y="10" width="80" height="80" fill="white" stroke="black"/>
        <circle cx="30" cy="30" r="5" fill="black"/>
        <circle cx="70" cy="30" r="5" fill="black"/>
        <circle cx="30" cy="70" r="5" fill="black"/>
        <circle cx="70" cy="70" r="5" fill="black"/>
        <circle cx="50" cy="50" r="5" fill="black"/>
     </svg>
    </div>
  )
}

export default Dice;
