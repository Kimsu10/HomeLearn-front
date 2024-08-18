import React from "react";
import "./TeacherMain.css";
import Question from "./Question";
import Lecture_State from "./Lecture_State";
import TeacherCalendar from "../../components/Calendar/TeacherCalendar/TeacherCalendar";
import Today_It from "./Today_It";
import Faq from "./Faq";
import { Route, Routes } from "react-router-dom";

import TeacherSideBar from "../../components/SideBar/TeacherSideBar";
import TeacherContact from "../Manager/TeacherContact";
import StudentContact from "../Manager/StudentContact";
import Notice from "../Manager/Notice";
import CurriculumManagement from "../Manager/CurriculumManagement";
import TeacherManagement from "../Manager/TeacherManagement";
import TeacherHeader from "../../components/Nav/TeacherHeader";

function TeacherDashBoard() {
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
            <Today_It />
          </div>
        </div>
      </>
  );
}

function TeacherMain() {
  return (
    <div className="teacher-App">
      <TeacherHeader />
      <div className="teacher-main-content">
        <TeacherSideBar />
        <div className="teacher-content-area">
          <Routes>
            <Route path="" element={<TeacherDashBoard />} />


            <Route
              path="manage-curriculums"
              element={<CurriculumManagement />}
            />
            <Route path="manage-teachers" element={<TeacherManagement />} />
            <Route path="notice" element={<Notice />} />
            <Route path="contact-students" element={<StudentContact />} />
            <Route path="contact-teachers" element={<TeacherContact />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default TeacherMain;
