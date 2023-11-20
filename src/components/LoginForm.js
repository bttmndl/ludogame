import React, { useState } from "react";
import facebook from "../assets/facebook.png";
import google from "../assets/google.png";
import twitter from "../assets/twitter.png";

const LoginForm = () => {
  const [hide, setHide] = useState(true);
  
  return (
    <div>
      <div>
        <div style={formParentStyle}>
          <div style={formStyle}>
            <div style={inputParentStyle}>
              <i
                class="fa fa-envelope-o"
                aria-hidden="true"
                style={iconStyle}
              ></i>
              <input
                type="text"
                placeholder="Please Enter Your Email"
                style={inputStyle}
              />
            </div>
            <div style={inputParentStyle}>
              {hide ? (
                <i
                  class="fa fa-eye-slash"
                  aria-hidden="true"
                  style={iconStyle}
                  onClick={() => setHide(false)}
                ></i>
              ) : (
                <i
                  class="fa fa-eye"
                  aria-hidden="true"
                  style={iconStyle}
                  onClick={() => setHide(true)}
                ></i>
              )}
              <input
                type="password"
                placeholder="Password"
                style={inputStyle}
              />
            </div>
            <div>
              <input style={checkBoxStyle} type="checkbox" />
              <label>Remember me?</label>
            </div>
            <div>
              <button style={loginButtonStyle}>Login</button>
            </div>
            <div style={OrStyle}>
              <p>or login with</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={google} style={socialLoginIconStyle} alt="google"/>
              <img src={facebook} style={socialLoginIconStyle} alt="facebook"/>
              <img src={twitter} style={socialLoginIconStyle} alt="twitter"/>
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
  width: "440px",
  height: "420px",
  padding: "20px",
};

const iconStyle = {
  position: "absolute",
  left: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "22px",
  cursor: "pointer",
};

const inputStyle = {
  width: "400px",
  height: "40px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  margin: "8px 0",
  textAlign: "center",
};

const inputParentStyle = {
  margin: "15px 0",
  position: "relative",
  display: "inline-block",
};

const checkBoxStyle = {
  margin: "10px",
};

const loginButtonStyle = {
  border: "none",
  width: "400px",
  height: "50px",
  borderRadius: "4px",
  backgroundColor: "#90EE90",
  color: "black",
  fontSize: "18px",
  cursor: "pointer",
};

const OrStyle = {
  marginTop: "20px",
  textAlign: "center",
};

const socialLoginIconStyle ={
  height: "60px",
  cursor:"pointer",
}

export default LoginForm;
