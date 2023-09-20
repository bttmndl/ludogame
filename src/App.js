import React, {useEffect, useState} from 'react'
import Main from './Main';
import Header from './components/Header';
import Body from './components/Body';
import Socket from './Socket.js';
import LudoBoard from './LudoBoard';

//10-4-12
//8-3-9
//6-2-6
const App = () => {
  const [count, setCount] = useState(10)
  // useEffect(()=>{
  //   const k = setInterval(()=>{setCount(pre=>pre+2)},[50]);
  //   return ()=> clearInterval(k);
  // },[count])
  // console.log(count)
  return (
    <div className="App">
      {/* <Header /> */}
      {/* <Body /> */}
      {/* <Main /> */}
      {/* <Socket /> */}
      <LudoBoard playerCount = {count}/>
    </div>
  );
}

export default App;
