import React, { useState } from "react";
import Main from "./Main";
import Header from "./components/Header";
import LudoBoard from "./LudoBoard";


const App = () => {
  const [count, setCount] = useState(4);
  const [SVG_SIZE, setSVG_SIZE] = useState(800); // Initial SVG size

  return (
    <div className="App">
      <div>
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
