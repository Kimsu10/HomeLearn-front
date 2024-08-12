import React, { useEffect, useRef, useState } from "react";
import StudentModal from "../../components/Modal/StudentModal/StudentModal";
import "./StudentAssignmentDetail.css";
import useGetFetch from "../../hooks/useGetFetch";

const StudentAssignmentDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: "",
  });

  const openModal = () => {
    setIsModalOpen(true);
    setIsModifyOpen(false);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      selectedFileName: file ? file.name : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("모달 데이터:", formData);
    closeModal();
  };

  const handleIconClick = () => {
    if (isModifyOpen === false) {
      setIsModifyOpen(true);
    } else if (isModifyOpen === true) {
      setIsModifyOpen(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: assignment, error: assignmentError } = useGetFetch(
    "/data/student/mainLecture/submittedAssginment.json",
    []
  );

  if (assignmentError) {
    return <div>Error: {assignmentError.message}</div>;
  }

  return (
    <div className="student_assignment_detail_main_container">
      <h1 className="student_assignment_detail_page_title">과제</h1>
      {/* 강사의 과제 공지 내용 */}
      <div className="student_assignment_detail_notice_box">
        <div className="student_assignment_detail_notice_title_box">
          <h3 className="student_assginment_detail_notice_title">
            Spring 게시판 제출 과제
          </h3>
          <a href="/assignment_files/응.없어~.zip" download>
            <span className="student_assignment_detail_notice_file">
              과제 자료.zip
            </span>
          </a>
        </div>
        <p className="student_assignment_detail_notice_content">
          Sprign MVC로 CRUD 기능을 구현해서 제출하세요
        </p>
        <div className="student_assignment_detail_notice_date_box">
          <span className="student_assignment_detail_notice_deadline">
            <span className="date_color">2024-08-31</span> 까지
          </span>
          <span className="student_assignment_detail_notice_write_date">
            <span className="date_color">2024-08-01</span> 까지
          </span>
        </div>
      </div>
      {/* 학생의 과제 제출 여부 및 제출한 과제 페이지 */}
      <div className="student_submit_assignment_title_box">
        <h1 className="student_submit_assignment_sub_title">제출 내역</h1>
        {assignment && assignment.id ? (
          <div>
            <i
              className="bi bi-three-dots-vertical show_modify_box_icon"
              onClick={handleIconClick}
            ></i>
            {isModifyOpen && (
              <div className="show_modify_box">
                <div className="modify_btn" onClick={openModal}>
                  수정
                </div>
                <div className="modify_btn" onClick="">
                  삭제
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      {assignment && assignment.id ? (
        <div className="student_submit_assignment_detail_box">
          <div className="student_submit_assignment_detail_title_box">
            <h1 className="student_submit_assignment_detail_title">
              {assignment.title}
            </h1>

            <a href={assignment.filePath} download={assignment.fileName}>
              <span className="student_submit_assignment_detail_file">
                {assignment.fileName}
              </span>
            </a>
          </div>
          <p className="student_submit_assignment_detail_content">
            {assignment.content}
          </p>
          <span className="student_submit_assignment_detail_date">
            <span className="date_color">{assignment.writeDate} </span>
            &nbsp;제출
          </span>
        </div>
      ) : (
        <div className="student_non_submit_assignment_detail_box">
          <h1 className="student_non_submit_assignment_detail_title">
            아직 과제를 제출하지 않았습니다.
          </h1>
          <button className="assignment_submit_button" onClick={openModal}>
            제출하기
          </button>
        </div>
      )}
      {/* 피드백 요소 */}
      {assignment && assignment.id && assignment.reple.id ? (
        <div className="student_submit_assignment_feedback_box">
          <h1 className="student_submit_assignment_sub_title">피드백</h1>
          <p className="student_submit_assignment_feedback_content">
            {assignment?.reple?.content}
          </p>
          <div className="student_submit_assignment_feedback_date_box">
            <span className="student_submit_assignment_feedback_date date_color">
              {assignment?.reple?.writeDate}
            </span>
            &nbsp;까지
          </div>
        </div>
      ) : (
        <></>
      )}
      <StudentModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        selectedFileName={formData.selectedFileName}
        modalName="과제 제출"
        contentTitle="제목"
        contentBody="내용"
        contentFile="파일 첨부"
        url="/students/homeworks"
        submitName="과제 제출"
        cancelName="제출 취소"
      />
    </div>
  );
};

export default StudentAssignmentDetail;
