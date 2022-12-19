import React from 'react'
import Blue from './Blue'
import Four from './Four'
import Green from './Green'
import Middle from './Middle'
import One from './One'
import Red from './Red'
import Two from './Two'
import Yellow from './Yellow'
import Three from './Three'

export default function Board() {
    const BoardDiv = {
      height: "600px",
      width: "600px",
      backgroundColor: "white",
      border: "0px solid black",
      marginLeft: "400px",
      marginTop: "80px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap:'wrap',
    };

    return (
        <div style={BoardDiv}>
            <Red />
            <One />
            <Green />
            <Two />
            <Middle />
            <Three />
            <Yellow />
            <Four />
            <Blue />
        </div>
    )
}
