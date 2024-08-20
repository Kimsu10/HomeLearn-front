import React, { useRef, useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./TeacherHeader.css";

const TeacherHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    curriculumFullName: "",
    progressRate: 0,
  });

  const [teacher, setTeacher] = useState({
    name: "",
    imagePath: "",
  });

  const [notifications, setNotifications] = useState([]);

  const getToken = () => localStorage.getItem("access-token");

  const deleteToken = () => {
    localStorage.removeItem("access-token");
    navigate("/login");
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
    <header id="teacher_header">
      <div className="teacher_h-inner">
        <div className="teacher_h-left">
          <h1 className="teacher_h-logo">
            <a className="teacher_navbar-brand" href="/">
              <img
                src="/images/logo/HomeLearn_Teacher_Header_Logo.png"
                alt="로고"
              />
            </a>
          </h1>
          <span className="teacher_h-curriculum_name">
            {curriculum.curriculumFullName}
          </span>
        </div>

        <div className="teacher_h-right">
          <div className="teacher_h-progress-bar">
            <div
              className="teacher_h-progress"
              style={{ width: `${curriculum.progressRate}%` }}
            ></div>
            <span className="teacher_h-progress-text">
              {curriculum.progressRate.toFixed(1)} / 100%
            </span>
          </div>

          <ul className="teacher_h-gnb_items">
            <li>
              <NavLink to="/">
                <span>
                  <i className="fa-solid fa-clipboard-list"></i>
                </span>
              </NavLink>
            </li>
            <div className="teacher_h-alarm" ref={alarmRef}>
              <div
                className="teacher_h-alarm_btn"
                onClick={(e) => toggleDropdown("teacher_alarm", e)}
              >
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <span>
                      <i className="fa-solid fa-bell"></i>
                    </span>
                    <span className="teacher_h-alarm_count">
                      {notifications.length}
                    </span>
                  </a>
                </li>
              </div>
              <ul
                id="teacher_h-alarm_list"
                className={`teacher_h-alarm_list ${
                  openDropdown === "teacher_alarm" ? "open" : ""
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

          <div className="teacher_h-profile_box" ref={profileRef}>
            <div
              className={`teacher_h-profile ${
                openDropdown === "teacher_profile" ? "active" : ""
              }`}
              onClick={(e) => toggleDropdown("teacher_profile", e)}
            >
              <div>
                <img
                  className="teacher_h-profile_img"
                  src={teacher.imagePath || "/images/TeacherProfile.png"} // 기본 이미지 사용
                  alt="프로필"
                />
              </div>
              <span className="teacher_h-profile_name">{teacher.name}</span>
              <i className="fa-solid fa-caret-down"></i>
            </div>
            <ul
              className={`teacher_h-profile_menu ${
                openDropdown === "teacher_profile" ? "open" : ""
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

export default TeacherHeader;
