import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import AuthHeader from "./AuthHeader";

const Authentication = () => {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <BrowserRouter>
      <div style={content}>
        <div style={contentStyle}>
          <AuthHeader
            showComponent={showComponent}
            setShowComponent={setShowComponent}
          />
          <div style={inner_style}>
            <Routes>
              <Route
                path="/"
                element={
                  <Login
                    showComponent={showComponent}
                    setShowComponent={setShowComponent}
                  />
                }
              />
              <Route
                path="/signup"
                element={
                  <Signup
                    showComponent={showComponent}
                    setShowComponent={setShowComponent}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

const content = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  backgroundColor: "white",
  zIndex: 999,
  overflow: "auto",
  maxWidth: "500px",
};
const contentStyle = {
  border: "1px solid grey",
  boxShadow: " 5px 5px 5px 5px #c9c3c3",
  width: "526px",
  padding: "5px",
};
const inner_style = {
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  flexDirection: "column",
};

export default Authentication;
