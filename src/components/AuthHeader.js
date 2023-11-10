import React from "react";
import { Link } from "react-router-dom";

function AuthHeader({ setShowComponent }) {
  return (
    <div style={headerParentStyle}>
      <div style={headerStyle}>
        <div className="login" onClick={() => setShowComponent(true)}>
          <Link to="/" style={{ textDecoration: "none", fontSize: "22px" }}>
            <b>Login</b>
          </Link>
        </div>

        <div className="signup" onClick={() => setShowComponent(false)}>
          <Link
            to="/signup"
            style={{ textDecoration: "none", fontSize: "22px" }}
          >
            <b>Signup</b>
          </Link>
        </div>
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
  width: "100%",
};

export default AuthHeader;
