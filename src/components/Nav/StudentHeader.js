import React, { useRef, useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import "./StudentHeader.css";

const StudentHeader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    name: "",
    th: 0,
    progress: 0,
  });

  const [student, setStudent] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [notifications, setNotifications] = useState([]);

  const getToken = () => localStorage.getItem("access-token");
  const deleteToken = () => localStorage.removeItem("access-token");

  useEffect(() => {
    if (!id) {
      console.error("Invalid curriculum ID");
      return;
    }

    const fetchData = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        const basicResponse = await axios.get(
          `/students/curriculum/${id}/basic`,
          config
        );
        setCurriculum(basicResponse.data);

        const studentResponse = await axios.get(`/students/info`, config);
        setStudent(studentResponse.data);

        const notificationResponse = await axios.get("/header/notifications", config);
        setNotifications(notificationResponse.data.notifications || []);
      } catch (error) {
        console.error("response 오류", error.response);
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
            {curriculum.name} {curriculum.th}기
          </span>
        </div>

        <div className="student_h-right">
          <div className="student_h-progress-bar">
            <div
              className="student_h-progress"
              style={{ width: `${curriculum.progress}%` }}
            ></div>
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
                <img className="student_h-profile_img" src="/" alt="프로필" />
              </div>
              <span className="student_h-profile_name">
                {student.name}
              </span>
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
