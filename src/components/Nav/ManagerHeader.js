import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./ManagerHeader.css";

const ManagerHeader = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const alarmRef = useRef(null);
  const profileRef = useRef(null);

  const deleteToken = () => localStorage.removeItem("access-token");

  const toggleDropdown = (dropdown, event) => {
    if (event) {
      event.preventDefault();
    }
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        alarmRef.current &&
        !alarmRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header id="manager_header">
      <div className="manager_h-inner">
        <div className="manager_h-left">
          <h1 className="manager_h-logo">
            <a className="manager_navbar-brand" href="/">
              <img
                src="/images/logo/HomeLearn_Manager_Header_Logo.png"
                alt="로고"
              />
            </a>
          </h1>
        </div>

        <div className="manager_h-right">
          <ul className="manager_h-gnb_items">
            <li>
              <NavLink to="/managers">
                <span>
                  <i className="fa-solid fa-clipboard-list"></i>
                </span>
              </NavLink>
            </li>

            <div className="manager_h-alarm" ref={alarmRef}>
              <div
                className="manager_h-alarm_btn"
                onClick={(e) => toggleDropdown("manager_alarm", e)}
              >
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>
                      <i className="fa-solid fa-bell"></i>
                    </span>
                    <span className="manager_h-alarm_count"></span>
                  </a>
                </li>
              </div>

              <ul
                id="manager_h-alarm_list"
                className={`manager_h-alarm_list ${
                  openDropdown === "manager_alarm" ? "open" : ""
                }`}
              >
                <div id="manager_h-alarm_list">
                  <li>
                    <span>알림 예시입니다.</span>
                  </li>
                  <li>
                    <span>알림 예시입니다.</span>
                  </li>
                  <li>
                    <span>알림 예시입니다.</span>
                  </li>
                </div>
              </ul>
            </div>
          </ul>

          <div className="manager_h-profile_box" ref={profileRef}>
            <div
              className={`manager_h-profile ${
                openDropdown === "manager_profile" ? "active" : ""
              }`}
              onClick={(e) => toggleDropdown("manager_profile", e)}
            >
              <div>
                <img className="manager_h-profile_img" src="/" alt="프로필" />
              </div>
              <span className="manager_h-profile_name">매니저</span>
              <i className="fa-solid fa-caret-down"></i>
            </div>

            <ul
              className={`manager_h-profile_menu ${
                openDropdown === "manager_profile" ? "open" : ""
              }`}
            >
              <li>
                <a href="/managers">마이페이지</a>
              </li>
              <li>
                <a href="/" onClick={() => deleteToken()}>
                  로그아웃
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
