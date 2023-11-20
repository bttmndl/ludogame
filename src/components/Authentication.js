import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import SignUP from "./SignUP";
import AuthHeader from "./AuthHeader";



const Authentication = ({ setRegisterPopUp }) => {
  return (
    <BrowserRouter>
      <div style={content}>
        <div style={crossStyle}>
          <button
            style={crossButtonStyle}
            onClick={() => setRegisterPopUp(false)}
          >
            X
          </button>
        </div>

        <div style={contentStyle}>
          <AuthHeader />

          <div style={inner_style}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUP/>} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

const content = {
  position: "fixed",
  top: "54%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  borderRadius: "8px",
  backgroundColor: "white",
  zIndex: 999,
  maxWidth: "600px",
};

const contentStyle = {
  border: "1px solid grey",
  boxShadow: " 1px 1px 1px 1px #c9c3c3",
  padding: "26px 8px",
  width: "480px",
  borderRadius: "8px",
};

const crossStyle = {
  height: "5px",
  width: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position:"relative",
  left:"99%"
};

const crossButtonStyle = {
  borderRadius: "50%",
  backgroundColor: "black",
  color: "#90EE90",
  fontSize:"20px"
};

const inner_style = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  flexDirection: "column",
};

export default Authentication;
