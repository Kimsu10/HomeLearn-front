import React, { useRef, useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./ManagerHeader.css";

const ManagerHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    curriculumFullName: "",
  });

  const [manager, setManager] = useState({
    name: "",
    imagePath: "",
  });

  const [notifications, setNotifications] = useState([]);

  const getToken = () => localStorage.getItem("access-token");

  const deleteToken = () => {
    localStorage.removeItem("access-token");
    navigate("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        const commonResponse = await axios.get("/header/common", config);
        setCurriculum(commonResponse.data);

        const notificationResponse = await axios.get(
          "/header/notifications",
          config
        );
        setNotifications(notificationResponse.data.notifications || []);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error.response);
      }
    };

    fetchData();
  }, [id]);

  const [openDropdown, setOpenDropdown] = useState(null);
  const alarmRef = useRef(null);
  const profileRef = useRef(null);

  const toggleDropdown = (dropdown, event) => {
    if (event) {
      event.preventDefault();
    }
    setOpenDropdown((prevState) => (prevState === dropdown ? null : dropdown));
  };

  const handleNotificationClick = (notification) => {
    if (notification.url) {
      navigate(notification.url);
    }
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
          <span className="manager_h-curriculum_name">
            {curriculum.curriculumFullName}
          </span>
        </div>

        <div className="manager_h-right">
          <ul className="manager_h-gnb_items">
            <li>
              <NavLink to="/">
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
                    <span className="manager_h-alarm_count">
                      {notifications.length}
                    </span>
                  </a>
                </li>
              </div>
              <ul
                id="manager_h-alarm_list"
                className={`manager_h-alarm_list ${
                  openDropdown === "manager_alarm" ? "open" : ""
                }`}
              >
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span>{notification.message}</span>
                    </li>
                  ))
                ) : (
                  <li>
                    <span>알림이 없습니다.</span>
                  </li>
                )}
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
                <img
                  className="manager_h-profile_img"
                  src={manager.imagePath || "/images/AdminProfile.png"}
                  alt="프로필"
                />
              </div>
              <span className="manager_h-profile_name">{manager.name}</span>
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
