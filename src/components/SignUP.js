import React from 'react'
import SignUpForm from './SignUpForm'

const SignUP = () => {
  return (
    <div style={SignupStyle}>
      <SignUpForm />
    </div>
  );
};

const SignupStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

export default SignUP;
