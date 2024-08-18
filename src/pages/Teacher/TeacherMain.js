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
                        {/*<Route path="/:subjectName/board"*/}
                        {/*       element={*/}
                        {/*        <TeacherLecture subject={selectedSubject} username={username} />*/}
                        {/*       }*/}
                        {/*/>*/}

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default TeacherMain;
