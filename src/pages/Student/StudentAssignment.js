import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentAssignment.css";
import { useNavigate } from "react-router-dom";

const StudentAssignment = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [curAssignment, setCurAssignment] = useState(null);
  const [curAssignmentLoading, setCurAssignmentLoading] = useState(true);
  const [curAssignmentError, setCurAssignmentError] = useState(null);

  const [endAssignments, setEndAssignments] = useState([]);
  const [endAssignmentsPage, setEndAssignmentsPage] = useState(0);
  const [endAssignmentsLoading, setEndAssignmentsLoading] = useState(true);
  const [endAssignmentsError, setEndAssignmentsError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //  진행중인 과제 요청
  useEffect(() => {
    const fetchCurAssignment = async () => {
      setCurAssignmentLoading(true);
      setCurAssignmentError(null);

      try {
        const response = await axios.get(
          `/students/homeworks/progress?page=${currentPage}`
        );
        setCurAssignment(response.data);
      } catch (error) {
        setCurAssignmentError(error);
      } finally {
        setCurAssignmentLoading(false);
      }
    };

    fetchCurAssignment();
  }, [currentPage]);

  // 마감된 과제 요청
  useEffect(() => {
    const fetchEndAssignments = async () => {
      setEndAssignmentsLoading(true);
      setEndAssignmentsError(null);

      try {
        const response = await axios.get(
          `/students/homeworks/closed?page=${endAssignmentsPage}`
        );
        setEndAssignments(response.data);
      } catch (error) {
        setEndAssignmentsError(error);
      } finally {
        setEndAssignmentsLoading(false);
      }
    };

    fetchEndAssignments();
  }, [endAssignmentsPage]);

  console.log(endAssignments);

  const totalPageNumber = curAssignment?.totalPages;
  const endAssignmentsTotalPages = endAssignments?.totalPages;

  if (curAssignmentError || endAssignmentsError) {
    return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
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

  return (
    <div className="student_assignment_main_container">
      <h1 className="student_assignment_page_title">과제</h1>
      <div className="current_proceeding_assignment_container">
        <div className="current_proceeding_assignment_title_box">
          <h3 className="current_proceeding_assignment_box_name">
            진행 중인 과제
          </h3>
          <div className="controll_box_with_both_side">
            <i
              className={`bi bi-chevron-left Right_and_left_button ${
                currentPage === 0 ? "disabled" : ""
              }`}
              onClick={handlePrevClick}
            ></i>
            <i
              className={`bi bi-chevron-right Right_and_left_button ${
                currentPage === totalPageNumber - 1 ? "disabled" : ""
              }`}
              onClick={handleNextClick}
            ></i>
          </div>
        </div>
        {/* 진행중인 과제 */}
        {currentAssignment ? (
          <div className="current_proceeding_assignment_contents_container">
            <div className="current_proceeding_assignment_contents_title_box">
              <h3 className="current_proceeding_assignment_contents_title">
                {currentAssignment.title}
              </h3>
              <span
                className="go_to_proceeding_assignment_page"
                onClick={() =>
                  navigate(
                    `/students/assignmentDetail/${currentAssignment.homeworkId}`
                  )
                }
              >
                자세히 보기 ⟩
              </span>
            </div>
            <p className="current_proceeding_assignment_contents">
              {currentAssignment.description}
            </p>
            <div className="current_proceeding_assignment_contents_additional_data_box">
              <p className="">
                <span className="current_proceeding_assignment_contents_deadline geen_text">
                  {currentAssignment.deadLine}
                </span>
                &nbsp;까지
              </p>
              <p className="current_proceeding_assignment_contents_Participants">
                <span className="current_proceeding_assignment_contents_Participants_count geen_text">
                  {currentAssignment.submitCount}
                </span>
                &nbsp;명 제출
              </p>
            </div>
          </div>
        ) : (
          <div className="empty_assignment_contents_container">
            진행 중인 과제가 없습니다.
          </div>
        )}
      </div>
      {/* 마감된 과제 */}
      <div className="closed_assignment_container">
        <div className="closed_assignment_title_box">
          <h3 className="closed_assignment_box_name">마감된 과제</h3>
          <div className="controll_box_with_both_side">
            <i
              className={`bi bi-chevron-left Right_and_left_button ${
                endAssignmentsPage === 0 ? "disabled" : ""
              }`}
              onClick={handleEndPrevClick}
            ></i>
            <i
              className={`bi bi-chevron-right Right_and_left_button ${
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
            <div className="closed_assignment_contents_container" key={idx}>
              <div className="closed_assignment_contents_title_box">
                <h3 className="closed_assignment_contents_title">{el.title}</h3>
                <span
                  className="go_to_closed_assignment_page"
                  onClick={() =>
                    navigate(`/students/assignmentDetail/${el.homeworkId}`)
                  }
                >
                  자세히 보기 ⟩
                </span>
              </div>
              <p className="closed_assignment_contents">{el.description}</p>
              <div className="closed_assignment_contents_additional_data_box">
                <p className="">
                  <span className="closed_assignment_contents_deadline geen_text">
                    {el.deadLine}
                  </span>
                  &nbsp;까지
                </p>
                <p className="closed_assignment_contents_Participants">
                  <span className="closed_assignment_contents_Participants_count geen_text">
                    {el.submitCount}
                  </span>
                  &nbsp;명 제출
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty_assignment_contents_container">
            <p>마감된 과제가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;
