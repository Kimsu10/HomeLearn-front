import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DefaultHeader.css";

const DefaultHeader = () => {
  const [token, setToken] = useState(localStorage.getItem("access-token"));

  if (!token) {
    return (
      <header id="default_header">
        <div className="default_h-inner">
          <div className="default_h-left">
            <h1 className="default_h-logo">
              <a className="default_navbar-brand" href="/">
                <img
                  src="/images/logo/HomeLearn_Default_Header_Logo.png"
                  alt="로고"
                />
              </a>
            </h1>
          </div>
          <div className="default_h-right">
            <Link to="/login" className="default_h-login_btn">
              로그인
            </Link>
          </div>
        </div>
      </header>
    );
  }
};

export default DefaultHeader;
