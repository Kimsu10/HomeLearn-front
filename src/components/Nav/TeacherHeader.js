import React, { useRef, useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "axios";
import "./TeacherHeader.css";

const TeacherHeader = () => {
  const { id } = useParams();
  const [curriculum, setCurriculum] = useState({
    name: "",
    th: 0,
    progress: 0,
  });

  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
        console.log("Token:", token);
        const config = {
          headers: { access: token },
        };

        console.log("ID 값:", id);

        const basicResponse = await axios.get(
          `/managers/curriculum/${id}/basic`,
          config
        );
        console.log("Basic:", basicResponse);
        setCurriculum(basicResponse.data);

        const teacherResponse = await axios.get(
          `/managers/curriculum/${id}/teacher`,
          config
        );
        console.log("강사:", teacherResponse);
        setTeacher(teacherResponse.data);
      } catch (error) {
        console.error("response 오류", error.response);
      }
    };

    fetchData();
  }, [id]);

  {
    /* DropDown (Alarm & Profile) */
  }
  const [openDropdown, setOpenDropdown] = useState(null);
  const alarmRef = useRef(null);
  const profileRef = useRef(null);

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
            {curriculum.name} {curriculum.th}기
          </span>
        </div>

        <div className="teacher_h-right">
          <div className="teacher_h-progress-bar">
            <div
              className="teacher_h-progress"
              style={{ width: `${curriculum.progress}%` }}
            ></div>
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
                    <span className="teacher_h-alarm_count"></span>
                  </a>
                </li>
              </div>
              <ul
                id="teacher_h-alarm_list"
                className={`teacher_h-alarm_list ${
                  openDropdown === "teacher_alarm" ? "open" : ""
                }`}
              >
                <div id="teacher_h-alarm_list">
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

          <div className="teacher_h-profile_box" ref={profileRef}>
            <div
              className={`teacher_h-profile ${
                openDropdown === "teacher_profile" ? "active" : ""
              }`}
              onClick={(e) => toggleDropdown("teacher_profile", e)}
            >
              <div>
                <img className="teacher_h-profile_img" src="/" alt="프로필" />
              </div>
              <span className="teacher_h-profile_name">
                {teacher.name}신지원
              </span>
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
