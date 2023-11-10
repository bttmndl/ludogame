import React, { useState } from "react";

const Form = ({showComponent}) => {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [confirmHiddenPassword, setConfirmHiddenPassword] = useState(true);

  return (
    <div style={formParentStyle}>
      <div style={formStyle}>
        <div style={inputParentStyle}>
            <i class="fa fa-envelope-o" aria-hidden="true" style={iconStyle}></i>
            <input type="text" placeholder="Please Enter Your Email" style={inputStyle} />
        </div>
        <div style={inputParentStyle}>
          <i class="fa fa-user" aria-hidden="true" style={iconStyle1}></i>
          <input type="text" placeholder="Enter Your Name" style={inputStyle1} />
        </div>
        <div style={inputParentStyle}>

          <i class="fa fa-user" aria-hidden="true" style={iconStyle2}></i>
          <input type="text" placeholder="Enter Your Surname" style={inputStyle2} />
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
  );
};

const formParentStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formStyle = {
  width: "500px",
  height: "550px",
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

const iconStyle1 = {
  position:"absolute",
  left: "30px", 
  top: "50%",
  transform: "translateY(-50%)",
  fontSize:"22px"
}

const iconStyle2 = {
  position:"absolute",
  left: "25px", 
  top: "50%",
  transform: "translateY(-50%)",
  fontSize:"22px"
}

const inputStyle2 = {
  width: "155px",
  height: "40px",
  margin: "0 20px 0 20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  textAlign:"center",
  
};

const inputStyle1 = {
  width: "155px",
  height: "40px",
  margin: "0 20px 0 20px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  padding: "8px",
  textAlign:"center",
  
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

export default Form;

