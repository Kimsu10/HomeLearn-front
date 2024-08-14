import "./TeacherMain.css";
import Question from "./Question";
import Lecture_State from "./Lecture_State";
import TeacherCalendar from "../../components/Calendar/TeacherCalendar/TeacherCalendar";
import SettingList from "./Today_It";
import Faq from "./Faq";
import {useNavigate, Routes, Route, useLocation} from "react-router-dom";
import React, { useEffect, useState } from "react";
import TeacherSideBar from "../../components/SideBar/TeacherSideBar";
import TeacherContact from "../Manager/TeacherContact";
import StudentContact from "../Manager/StudentContact";
import Notice from "../Manager/Notice";
import CurriculumManagement from "../Manager/CurriculumManagement";
import TeacherManagement from "../Manager/TeacherManagement";
import TeacherHeader from "../../components/Nav/TeacherHeader";
import TeacherLecture from "./TeacherLecture";
import { jwtDecode } from "jwt-decode";
import StudentLecture from "../Student/StudentLecture";

function Dashboard() {
  return (
      <>
        <h1>대시보드</h1>
        <div className="teacher-dashboard-grid-container">
          <div className="teacher-dashboard-grid">
            <Lecture_State />
            <Question />
            <Faq />
          </div>
          <div className="teacher-dashboard-grid2">
            <TeacherCalendar />
            <SettingList />
          </div>
        </div>
      </>
  );
}

function TeacherMain() {

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [username, setUsername] = useState("");
    const location = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access-token");

        try {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username);
        } catch (error) {
            console.error("jwt token 해석 실패 : ", error);
        }
    }, []);

    console.log(username); // 잘들어옴

  return (
        <div className="teacher-dashboard-body" id="container">
            <TeacherHeader />
            <TeacherSideBar />
          <div className="teacher-content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
                <Route
                    path=":subjectName/board"
                    element={
                        <TeacherLecture subject={selectedSubject} username={username} />
                    }
                />
              <Route path="manage-curriculums" element={<CurriculumManagement />} />
              <Route path="manage-teachers" element={<TeacherManagement />} />
              <Route path="notice" element={<Notice />} />
              <Route path="contact-students" element={<StudentContact />} />
              <Route path="contact-teachers" element={<TeacherContact />} />
            </Routes>
          </div>
        </div>

  );
}

export default TeacherMain;