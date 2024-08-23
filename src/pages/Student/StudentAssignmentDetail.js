import React, { useEffect, useState } from "react";
import StudentModal from "../../components/Modal/StudentModal/StudentModal";
import StudentPatchModal from "../../components/Modal/StudentModal/StudentPatchModal";
import "./StudentAssignmentDetail.css";
import useAxiosGet from "../../hooks/useAxiosGet";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentAssignmentDetail = ({ baseUrl }) => {
  const { homeworkId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModifyBoxOpen, setIsModifyBoxOpen] = useState(false);
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setIsModifyBoxOpen(false);
    setIsPatchModalOpen(false);
  };

  const openModifyBox = () => {
    setIsModifyBoxOpen(true);
    setIsModalOpen(false);
    setIsPatchModalOpen(false);
  };

  const openPatchModal = () => {
    setIsPatchModalOpen(true);
    setIsModifyBoxOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModifyBoxOpen(false);
    setIsPatchModalOpen(false);
  };

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

    closeModal();
  };

  const handleIconClick = () => {
    openModifyBox();
  };

  // 과제 내용 GET 요청
  const { data: assignmentDetail } = useAxiosGet(
    `/students/homeworks/${homeworkId}`
  );

  // 과제 제출 내역 GET 요청
  const { data: assignment } = useAxiosGet(
    `/students/homeworks/${homeworkId}/my-submit`,
    []
  );

  // 과제 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`/students/homeworks/${assignment.mySubmitId}`);
      window.location.reload();
    } catch (err) {
      console.error("과제 삭제 중 오류 발생:", err);
    }
  };

  const splitDate = (date) => {
    return date ? date.slice(0, 10) : "no deadline";
  };

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await axios.get(`${baseUrl}/attach-file/${filePath}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  console.log(assignmentDetail);

  return (
    <div className="student_assignment_detail_main_container">
      <h1 className="student_assignment_detail_page_title">과제</h1>

      {/* 강사의 과제 공지 내용 */}
      <div className="student_assignment_detail_notice_box">
        <div className="student_assignment_detail_notice_title_box">
          <h3 className="student_assginment_detail_notice_title">
            {assignmentDetail?.title}
          </h3>
          <span
            className="student_assignment_detail_notice_file"
            onClick={() =>
              downloadFile(
                assignmentDetail?.uploadFilePath,
                assignmentDetail?.uploadFileName
              )
            }
          >
            {assignmentDetail?.uploadFileName}
          </span>
          {/* </a> */}
        </div>
        <p className="student_assignment_detail_notice_content">
          {assignmentDetail?.description}
        </p>
        <div className="student_assignment_detail_notice_date_box">
          <span className="student_assignment_detail_notice_deadline">
            <span className="date_color">
              {splitDate(assignmentDetail?.deadLine)}
            </span>
            까지
          </span>
          <span className="student_assignment_detail_notice_write_date">
            <span className="date_color">
              {splitDate(assignmentDetail?.createdDate)}
            </span>
            작성
          </span>
        </div>
      </div>

      {/* 학생의 과제 제출 여부 및 제출한 과제 페이지 */}
      <div className="student_submit_assignment_title_box">
        <h1 className="student_submit_assignment_sub_title">제출 내역</h1>
        {assignment && assignment.mySubmitId ? (
          <div>
            <i
              className="bi bi-three-dots-vertical show_modify_box_icon"
              onClick={handleIconClick}
            ></i>
            {isModifyBoxOpen && (
              <div className="show_modify_box">
                <div className="modify_btn" onClick={openPatchModal}>
                  수정
                </div>
                <div className="modify_btn" onClick={handleDelete}>
                  삭제
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {assignment && assignment.mySubmitId ? (
        <div className="student_submit_assignment_detail_box">
          <div className="student_submit_assignment_detail_title_box">
            <h1 className="student_submit_assignment_detail_title">
              {assignment.description}
            </h1>
            <span
              className="student_submit_assignment_detail_file"
              onClick={() =>
                downloadFile(
                  assignment.uploadFilePath,
                  assignment.uploadFileName
                )
              }
            >
              {assignment.uploadFileName}
            </span>
          </div>
          <span className="student_submit_assignment_detail_date">
            <span className="date_color">{assignment.createDate}</span>
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
      {assignment && assignment.response ? (
        <div className="student_submit_assignment_feedback_box">
          <h1 className="student_submit_assignment_sub_title">피드백</h1>
          <p className="student_submit_assignment_feedback_content">
            {assignment.response}
          </p>
          <div className="student_submit_assignment_feedback_date_box">
            <span className="student_submit_assignment_feedback_date date_color">
              {assignment.responseDate}
            </span>
            &nbsp; 작성
          </div>
        </div>
      ) : null}

      <StudentModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        selectedFileName={formData.selectedFileName}
        modalName="과제 제출"
        contentBody="내용"
        contentFile="파일 첨부"
        url="/students/homeworks"
        submitName="과제 제출"
        cancelName="제출 취소"
      />

      <StudentPatchModal
        isOpen={isPatchModalOpen}
        closeModal={closeModal}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        modalName="과제 수정"
        contentBody="내용"
        contentFile="파일 첨부"
        isFile={assignment.uploadFileName}
        url="/students/homeworks"
        submitName="과제 수정"
        cancelName="수정 취소"
      />
    </div>
  );
};

export default StudentAssignmentDetail;
