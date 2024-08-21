import React, { useEffect, useState } from "react";
import "./TeacherAssignment.css";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";
import { useNavigate } from "react-router-dom";

const TeacherAssignment = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleDetailView = (assignmentId) => {
        navigate(`/teachers/assignmentDetail/${assignmentId}`);
    };

    return (
        <div className="teacher_assignment_main_container">
            <div className="teacher_assignment_page_title_box">
                <h1 className="teacher_assignment_page_title">과제</h1>
                <span className="teacher_assignment_page_enroll_btn" onClick={openModal}>
                    과제 등록
                </span>
            </div>
            <div className="teacher_current_proceeding_assignment_container">
                <div className="teacher_current_proceeding_assignment_title_box">
                    <h3 className="teacher_current_proceeding_assignment_box_name">
                        진행 중인 과제
                    </h3>
                    <div className="teacher_control_box_with_both_side">
                        <i className="bi bi-chevron-left teacher_Right_and_left_button"></i>
                        <i className="bi bi-chevron-right teacher_Right_and_left_button"></i>
                    </div>
                </div>

                {/* 진행 중인 과제 */}
                <div className="teacher_current_proceeding_assignment_contents_container">
                    <div className="teacher_current_proceeding_assignment_contents_title_box">
                        <h3 className="teacher_current_proceeding_assignment_contents_title">
                            Spring으로 게시판 생성
                        </h3>
                        <span
                            className="teacher_go_to_proceeding_assignment_page"
                            onClick={() => handleDetailView(1)} // 1은 예시 ID입니다. 실제 과제 ID로 대체해야 합니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_current_proceeding_assignment_contents">
                        Spring MVC로 CRUD를 고려하여 게시판 생성
                    </p>
                    <div className="teacher_current_proceeding_assignment_contents_additional_data_box">
                        <p className="">
                            <span className="teacher_current_proceeding_assignment_contents_deadline teacher_geen_text">
                                2024.08.26. 23:59
                            </span>
                            &nbsp;까지
                        </p>
                        <p className="teacher_current_proceeding_assignment_contents_Participants">
                            <span className="teacher_current_proceeding_assignment_contents_Participants_count teacher_geen_text">
                                28
                            </span>
                            &nbsp;명 제출
                        </p>
                    </div>
                </div>
            </div>

            {/* 마감된 과제 */}
            <div className="teacher_closed_assignment_container">
                <div className="teacher_closed_assignment_title_box">
                    <h3 className="teacher_closed_assignment_box_name">
                        마감된 과제
                    </h3>
                    <div className="teacher_control_box_with_both_side">
                        <i className="bi bi-chevron-left teacher_Right_and_left_button"></i>
                        <i className="bi bi-chevron-right teacher_Right_and_left_button"></i>
                    </div>
                </div>

                {/* 마감된 과제 리스트 */}
                <div className="teacher_closed_assignment_contents_container">
                    <div className="teacher_closed_assignment_contents_title_box">
                        <h3 className="teacher_closed_assignment_contents_title">
                            부트 오늘한거
                        </h3>
                        <span
                            className="teacher_go_to_closed_assignment_page"
                            onClick={() => handleDetailView(2)} // 2는 예시 ID입니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_closed_assignment_contents">
                        querydsl 코드 구현해주세요
                    </p>
                    <div className="teacher_closed_assignment_contents_additional_data_box">
                        <p className="">
                            <span className="teacher_closed_assignment_contents_deadline teacher_geen_text">
                                2024.07.05 23:59
                            </span>
                            &nbsp;까지
                        </p>
                        <p className="teacher_closed_assignment_contents_Participants">
                            <span className="teacher_closed_assignment_contents_Participants_count teacher_geen_text">
                                30
                            </span>
                            &nbsp;명 제출
                        </p>
                    </div>
                </div>
                <div className="teacher_closed_assignment_contents_container">
                    <div className="teacher_closed_assignment_contents_title_box">
                        <h3 className="teacher_closed_assignment_contents_title">
                            스프링부트 시큐리티
                        </h3>
                        <span
                            className="teacher_go_to_closed_assignment_page"
                            onClick={() => handleDetailView(3)} // 3은 예시 ID입니다.
                        >
                            자세히 보기 ⟩
                        </span>
                    </div>
                    <p className="teacher_closed_assignment_contents">
                        코드 구현해서 제출해주세요
                    </p>
                    <div className="teacher_closed_assignment_contents_additional_data_box">
                        <p className="">
                            <span className="teacher_closed_assignment_contents_deadline teacher_geen_text">
                                2024.07.20 23:59
                            </span>
                            &nbsp;까지
                        </p>
                        <p className="teacher_closed_assignment_contents_Participants">
                            <span className="teacher_closed_assignment_contents_Participants_count teacher_geen_text">
                                29
                            </span>
                            &nbsp;명 제출
                        </p>
                    </div>
                </div>
            </div>

            {/* Enroll Modal */}
            <TeacherModal isOpen={isModalOpen} onClose={closeModal}>
                <span className="teacher_assignment_modalTitle">과제 등록</span>
                <div className="teacher_assignment_enroll_form">
                    <div className="teacher_assignment_input_group">
                        <label>제목</label>
                        <input
                            type="text"
                            name="title"
                        />
                    </div>

                    <div className="teacher_assignment_textarea_group">
                        <label>내용</label>
                        <textarea
                            name="description"
                        >
                        </textarea>
                    </div>

                    <div className="teacher_assignment_date_group">
                        <label>마감일</label>
                        <input
                            type="date"
                            name="deadline"
                        />
                    </div>

                    <div className="teacher_assignment_file_radioBtn_group">
                        <label>파일 첨부 필수 여부</label>
                        <div className="teacher_assignment_file_radioBtn">
                            <button className="teacher_file_button">O</button>
                            <button className="teacher_file_button">X</button>
                        </div>
                    </div>

                    <div className="teacher_assignment_selectBox_group">
                        <label>파일 형식</label>
                        <select name="fileType">
                            <option value="">기타</option>
                            <option value=".java">.java</option>
                            <option value=".sql">.sql</option>
                            <option value=".pdf">.pdf</option>
                            <option value=".zip">.zip</option>
                            <option value=".html">.html</option>
                            <option value=".js">.js</option>
                            <option value=".txt">.txt</option>
                        </select>
                    </div>

                    <div className="teacher_assignment_file_group">
                        <label>파일 첨부</label>
                        <input
                            type="file"
                            name="file"
                        />
                    </div>

                    <div className="teacher_assignment_modal_buttons">
                        <button className="teacher_modal_enrollBtn">
                            과제 등록
                        </button>
                        <button className="teacher_modal_cancelBtn" onClick={closeModal}>
                            등록 취소
                        </button>
                    </div>
                </div>
            </TeacherModal>
        </div>
    );
};

export default TeacherAssignment;