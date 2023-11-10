import React, { useState } from "react";

const Login = ({showComponent}) => {
  const [hide, setHide] = useState(true);

  return (
    <div>
      <div>
        <div style={formParentStyle}>
          <div style={formStyle}>
            <div style={inputParentStyle}>
                <i class="fa fa-envelope-o" aria-hidden="true" style={iconStyle}></i>
                <input type="text" placeholder="Please Enter Your Email" style={inputStyle} />
            </div>
            <div style={inputParentStyle}>
                { hide ? 
                    <i class="fa fa-eye-slash" aria-hidden="true" style={iconStyle} onClick={()=>setHide(false)}></i> 
                    : 
                    <i class="fa fa-eye" aria-hidden="true" style={iconStyle} onClick={()=>setHide(true)}></i>
                }
                <input type="password" placeholder="Password" style={inputStyle} />
            </div>
            <div style={checkBoxStyle}>
                <label>
                    <input type="checkbox" />
                    Subscribe to Newsletter
              </label>
            </div>
            <div style={checkBoxStyle}>
                <label>
                    <input type="checkbox" />
                    I accept the Terms of Service & Privacy Policy
                </label>
            </div>
            <div>
              <button style={loginButtonStyle}> {showComponent? "Login" : "SignUp"} </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const formParentStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  width: "500px",
  height: "440px",
  padding: "20px",
  boxShadow:" 5px 5px 5px 5px #c9c3c3"
};

const iconStyle = {
  position:"absolute",
  left: "10px", 
  top: "50%",
  transform: "translateY(-50%)",
  fontSize:"22px"
}

const inputStyle = {
  width: "360px",
  height: "40px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  margin: "8px 0",
  textAlign:"center"
};

const inputParentStyle = {
    margin: "15px 0",
    position:"relative",
    display: "inline-block"
};

const checkBoxStyle = {
  margin: "10px 0",
};

const loginButtonStyle = {
  border: "none",
  width: "360px",
  height: "50px",
  borderRadius: "4px",
  backgroundColor: "#007BFF",
  color: "#fff",
  fontSize: "18px",
  cursor: "pointer",
};

export default Login;
