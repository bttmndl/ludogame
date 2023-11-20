import React, { useState } from "react";

const SignUpForm = () => {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [confirmHiddenPassword, setConfirmHiddenPassword] = useState(true);

  return (
    <div style={formParentStyle}>
      <div style={formStyle}>
        <div style={inputParentStyle}>
            <i class="fa fa-envelope-o" aria-hidden="true" style={iconStyle}></i>
            <input type="text" placeholder="Please Enter Your Email" style={inputStyle} />
        </div>
        <div style={inputParentStyle2}>
          <div style={inputParentStyle}>
            <i class="fa fa-user" aria-hidden="true" style={iconStyle1}></i>
            <input type="text" placeholder="First Name" style={inputStyle2} />
          </div>
          <div style={inputParentStyle}>

            <i class="fa fa-user" aria-hidden="true" style={iconStyle1}></i>
            <input type="text" placeholder="Last Name" style={inputStyle1} />
          </div>
        </div>
        <div style={inputParentStyle}>
                { hiddenPassword ? 
                    <i class="fa fa-eye-slash" aria-hidden="true" style={iconStyle} onClick={()=>setHiddenPassword(false)}></i> 
                    : 
                    <i class="fa fa-eye" aria-hidden="true" style={iconStyle} onClick={()=>setHiddenPassword(true)}></i>
                }
            <input type="password" placeholder="Password" style={inputStyle} />
        </div>
        <div style={inputParentStyle}>
                { confirmHiddenPassword ? 
                    <i class="fa fa-eye-slash" aria-hidden="true" style={iconStyle} onClick={()=>setConfirmHiddenPassword(false)}></i> 
                    : 
                    <i class="fa fa-eye" aria-hidden="true" style={iconStyle} onClick={()=>setConfirmHiddenPassword(true)}></i>
                }
            <input type="password" placeholder="Confirm Password" style={inputStyle} />
        </div>
        <div>
            <input style={checkBoxStyle} type="checkbox" />
            <label>
                I accept the Terms of Service & Privacy Policy
            </label>
        </div>
        <div>
          <button style={loginButtonStyle}> SignUp</button>
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
  position:"absolute",
  left: "10px", 
  top: "50%",
  transform: "translateY(-50%)",
  fontSize:"22px",
}

const inputStyle = {
  width: "400px",
  height: "40px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  textAlign:"center"
};

const inputParentStyle = {
  margin: "15px 0",
  position:"relative",
  display: "inline-block"
};

const iconStyle1 = {
  position:"absolute",
  left: "30px", 
  top: "50%",
  transform: "translateY(-50%)",
  fontSize:"22px"
}

const inputStyle1 = {
  width: "200px",
  height: "40px",
  margin: "0 20px 0 20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  textAlign:"center",
};

const inputParentStyle2 = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
}


const inputStyle2 = {
  width: "156px",
  height: "40px",
  margin: "0 20px 0 20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  textAlign:"center",
};

const checkBoxStyle = {
  marginRight: "10px",
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

export default SignUpForm;

