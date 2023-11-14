import React from "react";

const InputFeild = () => {
  return (
    <div style={inputParentStyle}>
      <i class="fa fa-envelope-o" aria-hidden="true" style={iconStyle}></i>
      <input
        type="text"
        placeholder="Please Enter Your Email"
        style={inputStyle}
      />
    </div>
  );
};

export default InputFeild;
