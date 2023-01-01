import React from "react";

const TriangleSVG = () => {
  return (
    <svg width="800" height="800">
      <style>
        {`
          .triangle {
            fill: none;
            stroke: black;
            stroke-width: 1;
          }
          .button {
            fill: white;
            stroke: black;
            stroke-width: 1;
            cursor: pointer;
          }
          .purple {
            fill: purple;
          }
          .red {
            fill: red;
          }
          .green {
            fill: green;
          }
          .blue {
            fill: blue;
          }
          .yellow {
            fill: yellow;
          }
          .orange {
            fill: orange;
          }
        `}
      </style>
      <polygon className="triangle purple" points="10,250 250,250, 130,80">

      </polygon>
      <polygon className="triangle" points="250,250 320,200 195,35 130,80">

      </polygon>
      <polygon className="triangle red" points="195,35 435,35 320,200">

      </polygon>
      <polygon className="triangle" points="320,200 390,250 500,80 435,35">

      </polygon>
      <polygon className="triangle green" points="390,250 630,250 500,80">

      </polygon>
      <polygon className="triangle" points="10,250 10,330 250,330 250,250">

      </polygon>
      <polygon className="triangle" points="390,250 390,330 630,330 630,250">

      </polygon>
      <polygon className="triangle yellow" points="10,330 130,500 250,330">
        
      </polygon>
      <polygon className="triangle" points="130,500 195,560 320,380 250,330">

      </polygon>
      <polygon className="triangle blue" points="195,560 435,560 320,380">

      </polygon>
      <polygon className="triangle" points="435,560 500,500 390,330 320,380">

      </polygon>
      <polygon className="triangle green" points="500,500 630,330 390,330">

      </polygon>
    </svg>
  );
};

export default TriangleSVG;
