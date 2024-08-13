import "./TeacherMain.css";
import Question from "./Question";
import Lecture_State from "./Lecture_State";
import TeacherCalendar from "../../components/Calendar/TeacherCalendar/TeacherCalendar";
import SettingList from "./Today_It";
import Faq from "./Faq";
import { useNavigate, Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TeacherSideBar from "../../components/SideBar/TeacherSideBar";
import TeacherContact from "../Manager/TeacherContact";
import StudentContact from "../Manager/StudentContact";
import Notice from "../Manager/Notice";
import CurriculumManagement from "../Manager/CurriculumManagement";
import TeacherManagement from "../Manager/TeacherManagement";
import TeacherHeader from "../../components/Nav/TeacherHeader";
import { jwtDecode } from "jwt-decode";

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
  return (
      <div className="teacher-App" id="container">
        <TeacherHeader />
        <div className="teacher-content-wrapper">
          <TeacherSideBar />
          <div className="teacher-content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="manage-curriculums" element={<CurriculumManagement />} />
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