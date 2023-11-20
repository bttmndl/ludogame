import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthHeader = ()=> {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("login");

  function handleLoginClick() {
    navigate("/");
    setIsActive("login");
  }

  function handleSignupClick() {
    navigate("/signup");
    setIsActive("signup");
  }

  return (
    <div style={headerParentStyle}>
      <div style={headerStyle}>
        <button
          onClick={handleLoginClick}
          style={{
            ...itemStyle,
            backgroundColor: isActive === "login" ? "#90EE90" : "white",
           
          }}
        >
          Login
        </button>
        
        <button
          onClick={handleSignupClick}
          style={{
            ...itemStyle,
            backgroundColor: isActive === "signup" ? "#90EE90" : "white",
            
          }}
        >
          Signup
        </button>
      </div>
    </div>
  );
}

const headerParentStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  width: "500px",
  height: "50px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  width: "80%",
  marginTop:"20px",
  marginRight: "40px",
  border: "1px solid green",
};

const itemStyle = {
  fontSize: "22px",
  padding: "8px",
  textAlign: "center",
  width: "50%",
  border: "1px solid grey",
  cursor: "pointer",
  color:  "black" ,
};

export default AuthHeader;
