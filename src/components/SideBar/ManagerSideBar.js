import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./ManagerSideBar.css";

const ManagerSideBar = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${
      ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
    })`;
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    setDropdownOpen(location.pathname.includes("/managers/contact-"));
  }, [location]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isActive = (path) => {
    if (path === "/managers") {
      return (
        location.pathname === "/managers" || location.pathname === "/managers/"
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="manager_sideBar_container">
      <div className="manager_sideBar_content">
        <div className="manager_sideBar_date_box">
          <span className="manager_sideBar_date">{currentDate}</span>
        </div>
        <div className="manager_sideBar_link">
          <ul className="manager_sideBar_menu">
            <li>
              <NavLink
                to="/managers"
                end
                className={({ isActive }) =>
                  isActive
                    ? "manager_sideBar_link active"
                    : "manager_sideBar_link"
                }
              >
                대시보드
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/managers/manage-curriculums"
                className={({ isActive }) =>
                  isActive
                    ? "manager_sideBar_link active"
                    : "manager_sideBar_link"
                }
              >
                교육 과정
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/managers/manage-students"
                className={({ isActive }) =>
                  isActive
                    ? "manager_sideBar_link active"
                    : "manager_sideBar_link"
                }
              >
                학생 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/managers/manage-teachers"
                className={({ isActive }) =>
                  isActive
                    ? "manager_sideBar_link active"
                    : "manager_sideBar_link"
                }
              >
                강사 관리
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/managers/notice"
                className={({ isActive }) =>
                  isActive
                    ? "manager_sideBar_link active"
                    : "manager_sideBar_link"
                }
              >
                공지사항
              </NavLink>
            </li>
            <li
              className={`manager_sideBar_dropdown ${
                dropdownOpen ? "open" : ""
              }`}
            >
              <div
                className={`manager_sideBar_dropdownHeader ${
                  isActive("/managers/contact-") ? "active" : ""
                }`}
                onClick={toggleDropdown}
              >
                문의
                <span
                  className={`manager_sideBar_dropdownArrow ${
                    dropdownOpen ? "open" : ""
                  }`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </span>
              </div>
              <ul
                className={`manager_sideBar_subMenu ${
                  dropdownOpen ? "open" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/managers/contact-students"
                    className={({ isActive }) =>
                      isActive
                        ? "manager_sideBar_link active"
                        : "manager_sideBar_link"
                    }
                  >
                    학생 문의
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/managers/contact-teachers"
                    className={({ isActive }) =>
                      isActive
                        ? "manager_sideBar_link active"
                        : "manager_sideBar_link"
                    }
                  >
                    강사 문의
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div className="manager_sideBar_line"></div>
    </div>
  );
};

export default ManagerSideBar;
