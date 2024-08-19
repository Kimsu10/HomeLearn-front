import React, { useRef, useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./StudentHeader.css";

const StudentHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    curriculumFullName: "",
    progressRate: 0,
  });

  const [student, setStudent] = useState({
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

        // 알림 정보 가져오기
        const notificationResponse = await axios.get("/header/notifications", config);
        setNotifications(notificationResponse.data.notifications || []);

        console.log("알림 정보:", notificationResponse.data.notifications);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error.response);
      }
    };

    fetchData();
  }, []);

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
    <header id="student_header">
      <div className="student_h-inner">
        <div className="student_h-left">
          <h1 className="student_h-logo">
            <a className="student_navbar-brand" href="/">
              <img
                src="/images/logo/HomeLearn_Student_Header_Logo.png"
                alt="로고"
              />
            </a>
          </h1>
          <span className="student_h-curriculum_name">
            {curriculum.curriculumFullName}
          </span>
        </div>

        <div className="student_h-right">
          <div className="student_h-progress-bar">
            <div
              className="student_h-progress"
              style={{ width: `${curriculum.progressRate}%` }}
            ></div>
            <span className="student_h-progress-text">
              {curriculum.progressRate.toFixed(1)} / 100%
            </span>
          </div>

          <ul className="student_h-gnb_items">
            <li>
              <NavLink to="/">
                <span>
                  <i className="fa-solid fa-clipboard-list"></i>
                </span>
              </NavLink>
            </li>
            <div className="student_h-alarm" ref={alarmRef}>
              <div
                className="student_h-alarm_btn"
                onClick={(e) => toggleDropdown("student_alarm", e)}
              >
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>
                      <i className="fa-solid fa-bell"></i>
                    </span>
                    <span className="student_h-alarm_count">
                      {notifications.length}
                    </span>
                  </a>
                </li>
              </div>
              <ul
                id="student_h-alarm_list"
                className={`student_h-alarm_list ${
                  openDropdown === "student_alarm" ? "open" : ""
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

          <div className="student_h-profile_box" ref={profileRef}>
            <div
              className={`student_h-profile ${
                openDropdown === "student_profile" ? "active" : ""
              }`}
              onClick={(e) => toggleDropdown("student_profile", e)}
            >
              <div>
                <img
                  className="student_h-profile_img"
                  src={student.imagePath || "/default-profile.png"}
                  alt="프로필"
                />
              </div>
              <span className="student_h-profile_name">{student.name}</span>
              <i className="fa-solid fa-caret-down"></i>
            </div>
            <ul
              className={`student_h-profile_menu ${
                openDropdown === "student_profile" ? "open" : ""
              }`}
            >
              <li>
                <a href="/">마이페이지</a>
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

export default StudentHeader;
