import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./StudentDashBoard.css";
import StudentLecture from "./StudentLecture";
import StudentAssignment from "./StudentAssignment";
import StudentLectureList from "./StudentLectureList";
import StudentFreeBoard from "./StudentFreeBoard";
import StudentQuestionBoard from "./StudentQuestionBoard";
import StudentDashBoard from "./StudentDashBoard";
import StudentSubjectBoardList from "./StudentSubjectBoardList";
import StudentSubjectBoardDetail from "./StudentSubjectBoardDetail";
import StudentLectureDetail from "./StudentLectureDetail";
import StudentAssignmentDetail from "./StudentAssignmentDetail";
import StudentSideBar from "../../components/SideBar/StudentSideBar";
import StudentHeader from "../../components/Nav/StudentHeader";
import StudentBadge from "./StudentBadge";
import StudentFreeBoardDetail from "./StudentFreeBoardDetail";
import SurveyForm from "./SurveyForm";
import StudentQuestionBoardDetail from "./StudentQuestionBoardDetail";

const StudentMain = () => {
  // const [showSection, setShowSection] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem("access-token");
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
    } catch (error) {
      console.error("jwt token 해석 실패 : ", error);
    }
  }, []);

  return (
    <div className="student_dashboard_body" id="container">
      <StudentHeader />
      <StudentSideBar />
      <div className="contents">
        <Routes>
          <Route
            path=""
            element={<StudentDashBoard username={username} baseUrl={baseUrl} />}
          />
          <Route
            path=":subjectName/board"
            element={
              <StudentLecture
                subject={selectedSubject}
                username={username}
                baseUrl={baseUrl}
                token={token}
              />
            }
          />
          <Route
            path="assignment"
            element={<StudentAssignment username={username} />}
          />
          <Route
            path="/:subjectName/board/list"
            element={
              <StudentSubjectBoardList username={username} baseUrl={baseUrl} />
            }
          />
          <Route
            path="/:subjectName/boardDetail/:id"
            element={
              <StudentSubjectBoardDetail
                username={username}
                baseUrl={baseUrl}
              />
            }
          />
          <Route
            path="/lecture"
            element={<StudentLectureList username={username} />}
          />
          <Route
            path="/:subjectName/lecture/:lecutreId"
            element={<StudentLectureDetail username={username} />}
          />
          <Route
            path="/questionBoards"
            element={<StudentQuestionBoard username={username} />}
          />
          <Route
            path="/questionBoards/:questionBoardId"
            element={<StudentQuestionBoardDetail username={username} />}
          />
          <Route
            path="/freeBoard"
            element={<StudentFreeBoard username={username} />}
          />
          <Route
            path="/assignmentDetail/:homeworkId"
            element={<StudentAssignmentDetail username={username} />}
          />
          <Route
            path="/:studentId/badge"
            element={<StudentBadge username={username} baseUrl={baseUrl} />}
          />
          <Route
            path="/freeboard/:boardId"
            element={<StudentFreeBoardDetail username={username} />}
          />
          {/* 현재 임시로 선생님 과제 상세 페이지 -> 아래의 페이지가 강사가 봐야할 학생들의 과제제출 페이지 넣을 예정 */}
          {/* 언젠가 들어올 강사 공지사항 페이지 */}
          {/* <Route path="/teacherNotice" element={< />} /> */}
          {/* 언젠가 들어올 매니저 공지사항 페이지 */}
          {/* <Route path="/teacherNotice" element={< />} /> */}
          {/* 언젠가 들어올 투표 페이지 */}
          {/* <Route path="/teacherNotice" element={< />} /> */}
          <Route path="/survey/:surveyId" element={<SurveyForm />} />
          {/* 설문조사 */}
        </Routes>
      </div>
    </div>
  );
};

export default StudentMain;
