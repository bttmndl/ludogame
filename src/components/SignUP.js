import React from 'react'
import Form from './Form'

const Signup = ({showComponent, setShowComponent}) => {
  return (
    <div>
        <Form showComponent={showComponent} setShowComponent={setShowComponent}/> 
    </div>
  )
}

export default Signup
