import React, {useEffect, useState} from 'react'
import Main from './Main';
import Header from './components/Header';
import Body from './components/Body';
import Socket from './Socket.js';
import LudoBoard from './LudoBoard';

const App = () => {
  const [count, setCount] = useState(6)
  // useEffect(()=>{
  //   const k = setInterval(()=>{setCount(pre=>pre+2)},[5000]);
  //   return ()=> clearInterval(k);
  // },[count])
  // console.log(count)
  return (
    <div className="App" style={{display:"flex", justifyContent:"center",alignItems:'center'}}>
      {/* <Header /> */}
      {/* <Body /> */}
      {/* <Socket /> */}
      <LudoBoard playerCount = {count}/>
      {/* <Main /> */}
    </div>
  );
}

export default App;
