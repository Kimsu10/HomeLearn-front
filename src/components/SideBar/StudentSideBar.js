import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./StudentSideBar.css";

import useAxiosGet from "../../hooks/useAxiosGet";

const StudentSideBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();

  const { data: subjects, error: subjectError } = useAxiosGet("/side-bar", []);
  console.log(subjects);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/students/subject")) {
      setDropdownOpen("subject");
    } else if (path.startsWith("/students/board")) {
      setDropdownOpen("board");
    } else if (path.startsWith("/students/notice")) {
      setDropdownOpen("notice");
    } else if (path.startsWith("/students/contact")) {
      setDropdownOpen("contact");
    } else {
      setDropdownOpen(null);
    }
  }, [location]);

  const toggleDropdown = (menu) => {
    setDropdownOpen((prevState) => (prevState === menu ? null : menu));
  };

  const isActive = (path) => {
    if (path === "/students") {
      return (
        location.pathname === "/students" || location.pathname === "/students/"
      );
    }
    return location.pathname.startsWith(path);
  };

  if (subjectError) {
    return <div>Error loading sidebar data</div>;
  }

  return (
    <div className="student_sideBar_container">
      <div className="student_sideBar_content">
        {/* Profile */}
        <div className="student_sideBar_profile_box">
          <div className="student_sideBar_profile_left">
            <div className="student_sideBar_profile_image">
              <img className="student_sideBar_profile_img" alt="프로필" />
            </div>
          </div>

          <div className="student_sideBar_profile_right">
            <span className="student_sideBar_profile_name">
              {/*{student.name}*/}노승빈
            </span>
            <span className="student_sideBar_profile_curriculum">
              {/*{curriculum.name} {curriculum.th}기*/}네이버 클라우드 데브옵스
              10기
            </span>
            <div className="student_sideBar_profile_progress_bar">
              <div className="student_sideBar_profile_progress"></div>
            </div>
            <span className="student_sideBar_profile_progress_text">
              {/*{curriculum.progress?.toFixed(1)} / 100%*/}75.2 / 100%
            </span>
          </div>
        </div>
        <div className="student_sideBar_seperate_line"></div>

        <div className="student_sideBar_link">
          <ul className="student_sideBar_menu">
            {/* 1. Dashboard */}
            <li>
              <NavLink
                to="/students"
                end
                className={({ isActive }) =>
                  isActive
                    ? "student_sideBar_link active"
                    : "student_sideBar_link"
                }
              >
                대시보드
              </NavLink>
            </li>
            {/* 2. Subject */}
            <li
              className={`student_sideBar_dropdown ${
                dropdownOpen === "subject" ? "open" : ""
              }`}
            >
              <div
                className={`student_sideBar_dropdownHeader ${
                  isActive("/students/subject") ? "active" : ""
                }`}
                onClick={() => toggleDropdown("subject")}
              >
                과목
                <span
                  className={`student_sideBar_dropdownArrow ${
                    dropdownOpen === "subject" ? "open" : ""
                  }`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <ul
                className={`student_sideBar_subMenu ${
                  dropdownOpen === "subject" ? "open" : ""
                }`}
              >
                {subjects?.map((el, idx) => (
                  <li key={el.subjectId}>
                    <NavLink
                      to={`/students/${el.name}/board`}
                      className={({ isActive }) =>
                        isActive
                          ? "student_sideBar_link active"
                          : "student_sideBar_link"
                      }
                    >
                      {el.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {/* 3. Assignment */}
            <li>
              <NavLink
                to="/students/assignment"
                className={({ isActive }) =>
                  isActive
                    ? "student_sideBar_link active"
                    : "student_sideBar_link"
                }
              >
                과제
              </NavLink>
            </li>
            {/* 4. Lecture */}
            <li>
              <NavLink
                to="/students/lecture"
                className={({ isActive }) =>
                  isActive
                    ? "student_sideBar_link active"
                    : "student_sideBar_link"
                }
              >
                강의
              </NavLink>
            </li>
            {/* 5. Board */}
            <li
              className={`student_sideBar_dropdown ${
                dropdownOpen === "board" ? "open" : ""
              }`}
            >
              <div
                className={`student_sideBar_dropdownHeader ${
                  isActive("/students/board") ? "active" : ""
                }`}
                onClick={() => toggleDropdown("board")}
              >
                게시판
                <span
                  className={`student_sideBar_dropdownArrow ${
                    dropdownOpen === "board" ? "open" : ""
                  }`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <ul
                className={`student_sideBar_subMenu ${
                  dropdownOpen === "board" ? "open" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/students/freeBoard"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    자유 게시판
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/students/questionBoard"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    질문 게시판
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* 6. Notice */}
            <li
              className={`student_sideBar_dropdown ${
                dropdownOpen === "notice" ? "open" : ""
              }`}
            >
              <div
                className={`student_sideBar_dropdownHeader ${
                  isActive("/students/notice") ? "active" : ""
                }`}
                onClick={() => toggleDropdown("notice")}
              >
                공지사항
                <span
                  className={`student_sideBar_dropdownArrow ${
                    dropdownOpen === "notice" ? "open" : ""
                  }`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <ul
                className={`student_sideBar_subMenu ${
                  dropdownOpen === "notice" ? "open" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/students/notice/teacherNotice"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    강사 공지사항
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/students/notice/managerNotice"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    매니저 공지사항
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* 7. Contact */}
            <li
              className={`student_sideBar_dropdown ${
                dropdownOpen === "contact" ? "open" : ""
              }`}
            >
              <div
                className={`student_sideBar_dropdownHeader ${
                  isActive("/students/contact") ? "active" : ""
                }`}
                onClick={() => toggleDropdown("contact")}
              >
                문의
                <span
                  className={`student_sideBar_dropdownArrow ${
                    dropdownOpen === "contact" ? "open" : ""
                  }`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <ul
                className={`student_sideBar_subMenu ${
                  dropdownOpen === "contact" ? "open" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/students/contact/teacherContact"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    강사 문의
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/students/contact/managerContact"
                    className={({ isActive }) =>
                      isActive
                        ? "student_sideBar_link active"
                        : "student_sideBar_link"
                    }
                  >
                    매니저 문의
                  </NavLink>
                </li>
              </ul>
            </li>
            {/* 8. Vote */}
            <li>
              <NavLink
                to="/students/vote"
                className={({ isActive }) =>
                  isActive
                    ? "student_sideBar_link active"
                    : "student_sideBar_link"
                }
              >
                투표
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="student_sideBar_line"></div>
    </div>
  );
};

export default StudentSideBar;
