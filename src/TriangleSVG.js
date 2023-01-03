import React, { useState, useRef, useEffect } from "react";

const points = [
  // 1st row
  "250,250 272,233 252,205 232,222",
  "232,222 252,205 232,177 210,195",
  "210,195 232,177 214,152 192,169",
  "192,169 214,152 195,125 173,140",
  "173,140 195,125 175,95 152,112",
  "152,112 175,95 153,64 130,80",

  // 2nd row
  "153,64 175,50 195,80 175,95",
  "175,95 195,80 216,110 195,125",
  "195,125 216,110 234,137 214,152",
  "214,152 234,137 252,162 232,177",
  "232,177 252,162 255,180 252,205",
  "152,112 175,95 153,64 130,80",
];

const TriangleSVG = () => {
    const [color, setColor] = useState("purple");
    let k = null;
    
    const ref = useRef(null);

    useEffect(() => {
      const handleClick = () => {
        k = setInterval(() => {
          setColor((pre) =>
            pre == "black" ? (pre = "purple") : (pre = "black")
          );
        }, 100);
      };

      const element = ref.current;

      element.addEventListener("click", handleClick);

      return () => {
        element.removeEventListener("click", handleClick);
      };
    }, []);

  return (
    <div>
    
    <svg width="800" height="800">
      <style>
        {`
          .triangle {
            fill: none;
            stroke: black;
            stroke-width: 2;
          }
          
          .purple {
            fill: ${color};
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
      
      <polygon className="triangle purple" points="10,250 250,250, 130,80" ref={ref}>
          
      </polygon>
      
      <polygon className="triangle" points="250,250 320,200 195,35 130,80">
          
      </polygon>

      {[...Array(1)].map((_, row) => (
        [...Array(12)].map((_, col) => (
            <polygon
              points={points[col]}
              style={{ stroke: '#000', strokeWidth: 1, fill:'none' }}
            />
        ))
      ))}


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
      <polygon className="triangle orange" points="500,500 630,330 390,330">

      </polygon>
    </svg>
    </div>
  );
};

export default TriangleSVG;
