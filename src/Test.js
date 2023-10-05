import React, { useEffect, useState } from "react";

function Test() {
    const [len, setLen]  = useState(11);
    const [counter, setCounter] = useState(0);
    let k = null;
    useEffect(()=>{
        if(counter <len) 
            k = setInterval(()=>{
                setCounter(p=>p+1);
            },100)
        return ()=> clearInterval(k);
    },[counter])
  
  function ArrayForm(startX, startY, direction){
    const array = makeArray().map(cord=>cord.split(" ")
        .map((p) => p.split(","))
        .map((c) => c.map((k) => parseFloat(k))))
    if(direction ==="H") return array;
    const verticalArray = makeVerticalArray().map((cord) =>
        cord
        .split(" ")
        .map((p) => p.split(","))
        .map((c) => c.map((k) => parseFloat(k)))
    );
    return verticalArray;
    function makeArray() {
        const portion = String(len).length*25;
        const resCords = [
          `${startX},${startY} ${startX + portion},${startY} ${
            startX + portion
          },${startY - portion} ${startX},${startY - portion}`,
        ];
            
        for (let i = 1; i < len; i++) {
            let point = resCords[i - 1]
                .split(" ")
                .map((p) => p.split(","))
                .map((c) => c.map((k) => parseFloat(k)));
            resCords.push(
                `${point[1][0]},${point[1][1]} ${point[1][0] + portion},${
                point[1][1]
                } ${point[2][0] + portion},${point[2][1]} ${point[2][0]},${
                point[2][1]
                }`
            );
        }
        return resCords;
    }
    function makeVerticalArray() {
        const portion = String(len).length * 25;
        const resCords = [
          `${startX},${startY} ${startX + portion},${startY} ${
            startX + portion
          },${startY - portion} ${startX},${startY - portion}`,
        ];

        for (let i = 1; i < len; i++) {
            let point = resCords[i - 1]
                .split(" ")
                .map((p) => p.split(","))
                .map((c) => c.map((k) => parseFloat(k)));
            resCords.push(
                `${point[3][0]},${point[3][1]} ${point[2][0]},${
                point[2][1]
                } ${point[2][0]},${point[2][1]-portion} ${point[3][0]},${point[3][1]-portion}`
            );
        }
        return resCords;
    }
    return direction === "X" ? array : verticalArray; 
  }


  const array1 = ArrayForm(100,200,"H");
  const array2 = ArrayForm(100,300, "H");
  const arrow = ArrayForm(100, 250, "V")
  .map(e =>{
    const gap = 50;
    const x = e[0][0];
    const y= e[0][1];
    return `${x}${y + gap} ${x}${y + (2*gap)}`;
  });
  const verticalArray = ArrayForm(800,700,"V");
  console.log(arrow);
  return (
    <div>
      <svg width="100vw" height="100vh">
        {array1.map(
          (cord, index) =>
            counter >= index && (
              <polygon
                key={index}
                points={cord}
                stroke="black"
                strokeWidth="1"
                fill="none"
              />
            )
        )}
        {array2.map(
          (cord, index) =>
            counter >= index && (
              <polygon
                key={index}
                points={cord}
                stroke="black"
                strokeWidth="1"
                fill="none"
              />
            )
        )}
        {arrow.map(
          (cord, index) =>
            counter >= index && (
              <polygon
                key={index}
                points={cord}
                stroke="red"
                strokeWidth="1"
                fill="none"
              />
            )
        )}
        {verticalArray.map(
          (cord, index) =>
            counter >= index && (
              <polygon
                key={index}
                points={cord}
                stroke={index < 9 ? "black" : "none"}
                strokeWidth="1"
                fill="none"
              />
            )
        )}

        {array1.map(
          (cord, idx) =>
            counter >= idx && (
              <text
                x={(cord[0][0] + cord[2][0]) / 2 - String(idx).length * 8}
                y={(cord[0][1] + cord[2][1]) / 2 + 9}
                fill="black"
                style={{ fontFamily: "Arial", fontSize: "30px" }}
              >
                {Math.floor(Math.random(idx) * 10)}
              </text>
            )
        )}
      </svg>
    </div>
  );
}

export default Test;
