import React, {useEffect, useState} from "react";
import { useNavigate, Route, Routes } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "./TeacherMain.css";
import TeacherCalendar from "../../components/Calendar/TeacherCalendar/TeacherCalendar";
import Question from "./Question";
import Lecture_State from "./Lecture_State";
import Today_It from "./Today_It";
import Faq from "./Faq";

import TeacherSideBar from "../../components/SideBar/TeacherSideBar";
import TeacherHeader from "../../components/Nav/TeacherHeader";
import TeacherAssignment from "./TeacherAssignment";
import TeacherAssignmentDetail from "./TeacherAssignmentDetail";
import StudentSubjectBoardDetail from "../Student/StudentSubjectBoardDetail";
import StudentLectureList from "../Student/StudentLectureList";
import StudentLectureDetail from "../Student/StudentLectureDetail";
import StudentQuestionBoard from "../Student/StudentQuestionBoard";
import StudentQuestionBoardDetail from "../Student/StudentQuestionBoardDetail";

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

const TeacherMain = () => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [username, setUsername] = useState("");

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

    console.log(username);

    return (
        <div className="teacher-App">
            <TeacherHeader />
            <div className="teacher-main-content">
                <TeacherSideBar />
                <div className="teacher-content-area">
                    <Routes>
                        <Route path="" element={<TeacherDashBoard />} />
                        {/* 과목 */}
                        {/*<Route path="/:subjectName/board"*/}
                        {/*       element={*/}
                        {/*        <TeacherLecture subject={selectedSubject} username={username} />*/}
                        {/*       }*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/:subjectName/board/list"*/}
                        {/*    element={<TeacherSubjectBoardList username={username} />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/:subjectName/boardDetail/:id"*/}
                        {/*    element={<TeacherSubjectBoardDetail username={username} />}*/}
                        {/*/>*/}

                        {/* 과제 */}
                        <Route
                            path="assignment"
                            element={<TeacherAssignment username={username} />}
                        />
                        <Route
                            path="/assignmentDetail/:homeworkId"
                            element={<TeacherAssignmentDetail username={username} />}
                        />

                        {/* 강의 */}
                        {/*<Route*/}
                        {/*    path="/lecture"*/}
                        {/*    element={<TeacherLectureList username={username} />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/:subjectName/lecture/:lecutreId"*/}
                        {/*    element={<TeacherLectureDetail username={username} />}*/}
                        {/*/>*/}

                        {/* 질문 게시판 */}
                        {/*<Route*/}
                        {/*    path="/questionBoards"*/}
                        {/*    element={<TeacherQuestionBoard username={username} />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/questionBoards/:questionBoardId"*/}
                        {/*    element={<TeacherQuestionBoardDetail username={username} />}*/}
                        {/*/>*/}

                        {/* 공지사항 */}
                        {/*<Route*/}
                        {/*    path="/teacherNotice"*/}
                        {/*    element={<TeacherTeacherNotice username={username} />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/managerNotice"*/}
                        {/*    element={<TeacherManagerNotice username={username} />}*/}
                        {/*/>*/}

                        {/* 문의 */}
                        {/*<Route*/}
                        {/*    path="/teacherContact"*/}
                        {/*    element={<TeacherTeacherContact username={username} />}*/}
                        {/*/>*/}
                        {/*<Route*/}
                        {/*    path="/managerContact"*/}
                        {/*    element={<TeacherManagerContact username={username} />}*/}
                        {/*/>*/}

                        {/* 투표 */}
                        {/*<Route*/}
                        {/*    path="/teacherVote"*/}
                        {/*    element={<TeacherVote username={username} />}*/}
                        {/*/>*/}

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default TeacherMain;
