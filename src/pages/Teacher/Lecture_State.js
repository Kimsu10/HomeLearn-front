import React, { useState, useEffect } from 'react';
import './Lecture_State.css';

const Lecture_State = () => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`;
        setCurrentDate(formattedDate);
    }, []);


        return (
            <div className="Lecture_state_container">
                <div className="Lecture_state_title">
                    <h2 className="h2">수강 현황</h2>
                    <div className="Lecture_state_date">{currentDate}</div>
                </div>
                <div className="Lecture_state_chart_container">
                    <div className="Lecture_state_content">
                        <div className="attendance_state">
                            <h2 className="h2">출석 현황</h2>
                            <span>28/30 명</span>
                            <div className="chart1"></div>
                        </div>

                        <div className="homework_state">
                            <h2 className="h2">과제 제출</h2>
                            <span>spring 게시판 CRUD</span>
                            <div className="chart2"></div>
                        </div>
                    </div>
                </div>

            </div>
        );

};
export default Lecture_State;