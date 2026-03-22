import React, {useEffect, useState} from 'react'
import LudoBoard from './LudoBoard';

const App = () => {
  const [count, setCount] = useState(4);
  const [SVG_SIZE, setSVG_SIZE] = useState(800);
  
  return (
    <div className="App" >
      {[...Array(34)].map((e,i)=>(i%2===0 && i>= 4 && <button onClick={()=>setCount(i)}><h1>{i}</h1></button>))}
      <LudoBoard key={count} playerCount={count} SVG_SIZE={SVG_SIZE} />
    </div>
  );
}

export default App;
