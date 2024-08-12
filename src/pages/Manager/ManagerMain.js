import React from "react";
import { Route, Routes } from "react-router-dom";
import ManagerSideBar from "../../components/SideBar/ManagerSideBar";
import ManagerCalendar from "../../components/Calendar/ManagerCalendar/ManagerCalendar";
import CalendarDetail from "../../components/Calendar/ManagerCalendar/ManagerCalendarDetail";
import Lecture from "./Lecture";
import SettingList from "./Survey";
import MessageBox from "./MessageBox";
import StudentManagement from "./StudentManagement";
import CurriculumManagement from "./CurriculumManagement";
import TeacherManagement from "./TeacherManagement";
import Notice from "./Notice";
import StudentContact from "./StudentContact";
import TeacherContact from "./TeacherContact";
import CurriculumDetail from "./CurriculumDetail";
import StudentDetail from "./StudentDetail";
import SurveyDetail from "./SurveyDetail";
import "./ManagerMain.css";
import ManagerHeader from "../../components/Nav/ManagerHeader";

function Dashboard() {
  return (
    <>
      <h1>대시보드</h1>
      <div className="dashboard-grid">
        <div className="manager-dashboard-divide-box">
          <Lecture />
          <ManagerCalendar />
        </div>
        <div className="manager-dashboard-divide-box2">
          <SettingList />
          <MessageBox />
        </div>
      </div>
    </>
  );
}

function ManagerMain() {
  return (
    <div className="App">
      <ManagerHeader />
      <div className="main-content">
        <ManagerSideBar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="manage-students" element={<StudentManagement />} />
            <Route path="manage-students/:id" element={<StudentDetail />} />
            <Route path="manage-curriculums" element={<CurriculumManagement />} />
            <Route path="manage-curriculums/:id" element={<CurriculumDetail />} />
            <Route path="manage-teachers" element={<TeacherManagement />} />
            <Route path="notice" element={<Notice />} />
            <Route path="contact-students" element={<StudentContact />} />
            <Route path="contact-teachers" element={<TeacherContact />} />
            <Route path="calendar/:eventId" element={<CalendarDetail />} />
            <Route path="survey/:id" element={<SurveyDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default ManagerMain;
