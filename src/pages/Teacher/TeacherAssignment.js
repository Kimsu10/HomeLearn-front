import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import "./TeacherAssignment.css";
import { useNavigate } from "react-router-dom";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";

const TeacherAssignment = () => {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem("access-token");

    const [currentPage, setCurrentPage] = useState(0);
    const [curAssignment, setCurAssignment] = useState(null);
    const [curAssignmentLoading, setCurAssignmentLoading] = useState(true);
    const [curAssignmentError, setCurAssignmentError] = useState(null);

    const [endAssignments, setEndAssignments] = useState([]);
    const [endAssignmentsPage, setEndAssignmentsPage] = useState(0);
    const [endAssignmentsLoading, setEndAssignmentsLoading] = useState(true);
    const [endAssignmentsError, setEndAssignmentsError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    /* Assignment Enroll */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        deadline: "",
        attachedFile: "False",
        fileType: "",
        file: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await fetchCurAssignment();
                await fetchEndAssignments();
                setIsLoading(false);
            } catch (error) {
                console.error("데이터 초기화 중 오류 발생 : ", error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage, endAssignmentsPage]);

    // 진행 중 과제 요청
    const fetchCurAssignment = async () => {
        setCurAssignmentLoading(true);
        setCurAssignmentError(null);

        try {
            const response = await axios.get(
                `/teachers/homeworks/progress?page=${currentPage}`
            );
            setCurAssignment(response.data);
        } catch (error) {
            setCurAssignmentError(error);
        } finally {
            setCurAssignmentLoading(false);
        }
    };

    // 마감된 과제 요청
    const fetchEndAssignments = async () => {
        setEndAssignmentsLoading(true);
        setEndAssignmentsError(null);

        try {
            const response = await axios.get(
                `/teachers/homeworks/closed?page=${endAssignmentsPage}`
            );
            setEndAssignments(response.data);
        } catch (error) {
            setEndAssignmentsError(error);
        } finally {
            setEndAssignmentsLoading(false);
        }
    };

    const totalPageNumber = curAssignment?.totalPages;
    const endAssignmentsTotalPages = endAssignments?.totalPages;

    if (curAssignmentError || endAssignmentsError) {
        return (
            <div>데이터를 불러오는데 오류가 발생했습니다.
                <p>{curAssignmentError?.message || endAssignmentsError?.message}</p>
            </div>
        );
    }

    const currentAssignment =
        curAssignment && curAssignment.content.length > 0
            ? curAssignment.content[0]
            : null;

    const handleNextClick = () => {
        if (currentPage < totalPageNumber - 1) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevClick = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleEndNextClick = () => {
        if (endAssignmentsPage < endAssignmentsTotalPages - 1) {
            setEndAssignmentsPage((prev) => prev + 1);
        }
    };

    const handleEndPrevClick = () => {
        if (endAssignmentsPage > 0) {
            setEndAssignmentsPage((prev) => prev - 1);
        }
    };

    const handleInputChange = (e) =>
        setNewAssignment({ ...newAssignment, [e.target.name]: e.target.value });

    const handleAttachedFileChange = (attachedFile) => {
        setNewAssignment( {
            ...newAssignment,
            attachedFile: attachedFile,
        });
    };

    const handleFileChange = (e) => {
        setNewAssignment({ ...newAssignment, file: e.target.files[0] });
    };

    const handleEnrollAssignment = async () => {
        if (newAssignment.attachedFile === "True" && (!newAssignment.file || !newAssignment.fileType)) {
            alert("파일 형식과 파일을 모두 선택해 주세요.");
            return;
        }

        try {
            const token = getToken();

            const assignmentData = new FormData();
                assignmentData.append("title", newAssignment.title);
                assignmentData.append("description", newAssignment.description);
                assignmentData.append("deadline", newAssignment.deadline);
                if(newAssignment.attachedFile === "True") {
                    assignmentData.append("fileType", newAssignment.fileType);
                    assignmentData.append("file", newAssignment.file);
                }

            const response = await axios.post(
                `/teachers/homeworks/progress`,
                assignmentData,
                {
                    headers: { access: token },
                }
            );
            console.log("과제 등록 응답 : ", response.data);
            if (response.status === 200) {
                setIsModalOpen(false);
            } else {
                console.error("과제 등록 실패");
            }
        } catch (error) {
            console.error("과제 등록 중 오류 발생 : ", error);
        }
    }

    return (
        <div className="teacher_assignment_main_container">
            <div className="teacher_assignment_page_title_box">
                <h1 className="teacher_assignment_page_title">과제</h1>
                <span className="teacher_assignment_page_enroll_btn"
                      onClick={() => setIsModalOpen(true)}>
                    과제 등록
                </span>
            </div>
            {isLoading ? (
                <p>로딩 중...</p>
            ) : (
                <>
                <div className="teacher_current_proceeding_assignment_container">
                    <div className="teacher_current_proceeding_assignment_title_box">
                        <h3 className="teacher_current_proceeding_assignment_box_name">
                            진행 중인 과제
                        </h3>
                        <div className="teacher_control_box_with_both_side">
                            <i
                                className={`bi bi-chevron-left teacher_Right_and_left_button ${
                                    currentPage === 0 ? "disabled" : ""
                                }`}
                                onClick={handlePrevClick}
                            ></i>
                            <i
                                className={`bi bi-chevron-right teacher_Right_and_left_button ${
                                    currentPage === totalPageNumber - 1 ? "disabled" : ""
                                }`}
                                onClick={handleNextClick}
                            ></i>
                        </div>
                    </div>

                    {/* 진행 중인 과제 */}
                    {currentAssignment ? (
                        <div className="teacher_current_proceeding_assignment_contents_container">
                            <div className="teacher_current_proceeding_assignment_contents_title_box">
                                <h3 className="teacher_current_proceeding_assignment_contents_title">
                                    {currentAssignment.title}
                                </h3>
                                <span
                                    className="teacher_go_to_proceeding_assignment_page"
                                    onClick={() =>
                                        navigate(`/teachers/assignmentDetail/${currentAssignment.id}`)
                                    }
                                >
                            자세히 보기 ⟩
                          </span>
                        </div>
                            <p className="teacher_current_proceeding_assignment_contents">
                                {currentAssignment.description}
                            </p>
                            <div className="teacher_current_proceeding_assignment_contents_additional_data_box">
                                <p className="">
                    <span className="teacher_current_proceeding_assignment_contents_deadline teacher_geen_text">
                      {currentAssignment.deadline}
                    </span>
                                    &nbsp;까지
                                </p>
                                <p className="teacher_current_proceeding_assignment_contents_Participants">
                    <span className="teacher_current_proceeding_assignment_contents_Participants_count teacher_geen_text">
                      {currentAssignment.participants}
                    </span>
                                    &nbsp;명 제출
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="teacher_empty_assignment_contents_container">
                            진행 중인 과제가 없습니다.
                        </div>
                    )}
                </div>

                {/* 마감된 과제 */}
                <div className="teacher_closed_assignment_container">
                    <div className="teacher_closed_assignment_title_box">
                        <h3 className="teacher_closed_assignment_box_name">
                            마감된 과제
                        </h3>
                        <div className="teacher_control_box_with_both_side">
                            <i
                                className={`bi bi-chevron-left teacher_Right_and_left_button ${
                                    endAssignmentsPage === 0 ? "disabled" : ""
                                }`}
                                onClick={handleEndPrevClick}
                            ></i>
                            <i
                                className={`bi bi-chevron-right teacher_Right_and_left_button ${
                                    endAssignmentsPage === endAssignmentsTotalPages - 1
                                        ? "disabled"
                                        : ""
                                }`}
                                onClick={handleEndNextClick}
                            ></i>
                        </div>
                    </div>

                    {/* 마감된 과제 리스트 */}
                    {endAssignments?.content?.length > 0 ? (
                        endAssignments.content.map((el, idx) => (
                            <div className="teacher_closed_assignment_contents_container" key={idx}>
                                <div className="teacher_closed_assignment_contents_title_box">
                                    <h3 className="teacher_closed_assignment_contents_title">{el.title}</h3>
                                    <span
                                        className="teacher_go_to_closed_assignment_page"
                                        onClick={() =>
                                            navigate(`/teachers/assignmentDetail/${el.id}`)
                                        }
                                    >
                      자세히 보기 ⟩
                    </span>
                                </div>
                                <p className="teacher_closed_assignment_contents">{el.description}</p>
                                <div className="teacher_closed_assignment_contents_additional_data_box">
                                    <p className="">
                      <span className="teacher_closed_assignment_contents_deadline teacher_geen_text">
                        {el.deadline}
                      </span>
                                        &nbsp;까지
                                    </p>
                                    <p className="teacher_closed_assignment_contents_Participants">
                      <span className="teacher_closed_assignment_contents_Participants_count teacher_geen_text">
                        {el.participants}
                      </span>
                                        &nbsp;명 제출
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="teacher_empty_assignment_contents_container">
                            마감된 과제가 없습니다.
                        </div>
                    )}
                </div>
                </>
            )}
                {/* Enroll Modal */}
                <TeacherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <span className="teacher_assignment_modalTitle">과제 등록</span>
                    <div className="teacher_assignment_enroll_form">
                        <div className="teacher_assignment_input_group">
                            <label>제목</label>
                            <input
                                type="text"
                                name="title"
                                value={newAssignment.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="teacher_assignment_textarea_group">
                            <label>내용</label>
                            <textarea
                                name="description"
                                value={newAssignment.description}
                                onChange={handleInputChange}
                            >
                            </textarea>
                        </div>

                        <div className="teacher_assignment_date_group">
                            <label>마감일</label>
                            <input
                                type="date"
                                name="deadline"
                                value={newAssignment.deadline}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="teacher_assignment_file_radioBtn_group">
                            <label>파일 첨부 필수 여부</label>
                            <div className="teacher_assignment_file_radioBtn">
                                <button className={`teacher_file_button ${
                                    newAssignment.attachedFile === "True" ? "selected" : ""
                                }`}
                                onClick={() => handleAttachedFileChange("True")}>
                                O
                                </button>
                                <button className={`teacher_file_button ${
                                    newAssignment.attachedFile === "False" ? "selected" : ""
                                }`}
                                onClick={() => handleAttachedFileChange("False")}>
                                X
                                </button>
                            </div>
                        </div>

                        {newAssignment.attachedFile === "True" && (
                            <>
                                <div className="teacher_assignment_selectBox_group">
                                    <label>파일 형식</label>
                                    <select
                                        name="fileType"
                                        value={newAssignment.fileType}
                                        onChange={handleInputChange}
                                    >
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
                                        name="flie"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </>
                        )}
                        <div className="teacher_assignment_modal_buttons">
                            <button className="teacher_modal_enrollBtn" onClick={handleEnrollAssignment}>
                                과제 등록
                            </button>
                            <button className="teacher_modal_cancelBtn" onClick={() => setIsModalOpen(false)}>
                                등록 취소
                            </button>
                        </div>
                    </div>
                </TeacherModal>
            </div>

    );
};

export default TeacherAssignment;
