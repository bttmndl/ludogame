import React, { useEffect, useState } from "react";
import Main from "./Main";
import Header from "./components/Header";
// import Body from "./components/Body";
import LudoBoard from "./LudoBoard";


const App = () => {
  const [count, setCount] = useState(4);

  const [SVG_SIZE, setSVG_SIZE] = useState(800); // Initial SVG size

  return (
    <div className="App">
      <div>
        {/* {[...Array(34)].map(
          (e, i) =>
            i % 2 === 0 &&
            i >= 4 && (
              <button onClick={() => setCount(i)}>
                <h1>{i}</h1>
              </button>
            )
        )} */}

        <Header />

      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <LudoBoard playerCount={count} SVG_SIZE={SVG_SIZE} />
        <Main />
      </div>
    </div>
  );
};

export default App;
