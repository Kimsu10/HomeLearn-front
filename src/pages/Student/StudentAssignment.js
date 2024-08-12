import React, { useEffect, useState } from "react";
import "./StudentAssignment.css";
import { useNavigate } from "react-router-dom";
import useGetFetch from "../../hooks/useGetFetch";

const StudentAssignment = () => {
  const navigate = useNavigate();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [endAssignmentIdx, setEndAssignmentIdx] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: curAssignment,
    loading: curAssignmentLoading,
    error: curAssignmentError,
  } = useGetFetch("/data/student/mainLecture/currentAssignments.json", []);

  console.log(curAssignment);

  const {
    data: endAssignments,
    loading: endAssignmentsLoading,
    error: endAssignmentsError,
  } = useGetFetch("/data/student/mainLecture/endAssignments.json", []);

  console.log(endAssignments);

  if (curAssignmentLoading || endAssignmentsLoading) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }

  if (curAssignmentError || endAssignmentsError) {
    return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
  }

  const currentAssignment =
    curAssignment.length > 0 ? curAssignment[currentIdx] : null;

  const handlePrevClick = () => {
    setCurrentIdx((prev) => (prev === 0 ? curAssignment.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIdx((prev) => (prev === curAssignment.length - 1 ? 0 : prev + 1));
  };

  const handleEndPrevClick = () => {
    setEndAssignmentIdx((prev) =>
      prev === 0 ? endAssignments.length - 1 : prev - 1
    );
  };

  const handleEndNextClick = () => {
    setEndAssignmentIdx((prev) =>
      prev === endAssignments.length - 1 ? 0 : prev + 1
    );
  };

  const curEndAssignments = endAssignments.slice(
    endAssignmentIdx,
    endAssignmentIdx + 3
  );

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
                currentIdx === 0 ? "disabled" : ""
              }`}
              onClick={currentIdx !== 0 ? handlePrevClick : null}
            ></i>
            <i
              className={`bi bi-chevron-right Right_and_left_button ${
                currentIdx === curAssignment.length - 1 ? "disabled" : ""
              }`}
              onClick={
                currentIdx !== curAssignment.length - 1 ? handleNextClick : null
              }
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
                  navigate(`/students/assignmentDetail/${currentAssignment.id}`)
                }
              >
                자세히 보기 ⟩
              </span>
            </div>
            <p className="current_proceeding_assignment_contents">
              {currentAssignment.content}
            </p>
            <div className="current_proceeding_assignment_contents_additional_data_box">
              <p className="">
                <span className="current_proceeding_assignment_contents_deadline geen_text">
                  {currentAssignment.deadline}
                </span>
                &nbsp;까지
              </p>
              <p className="current_proceeding_assignment_contents_Participants">
                <span className="current_proceeding_assignment_contents_Participants_count geen_text">
                  {currentAssignment.participants}
                </span>
                &nbsp;명 제출
              </p>
            </div>
          </div>
        ) : (
          <div>진행 중인 과제가 없습니다.</div>
        )}
      </div>
      {/* 마감된 과제 */}
      <div className="closed_assignment_container">
        <div className="closed_assignment_title_box">
          <h3 className="closed_assignment_box_name">마감된 과제</h3>
          <div className="controll_box_with_both_side">
            <i
              className={`bi bi-chevron-left Right_and_left_button ${
                endAssignmentIdx === 0 ? "disabled" : ""
              }`}
              onClick={endAssignmentIdx !== 0 ? handleEndPrevClick : null}
            ></i>
            <i
              className={`bi bi-chevron-right Right_and_left_button ${
                endAssignmentIdx >= endAssignments.length - 3 ? "disabled" : ""
              }`}
              onClick={
                endAssignmentIdx < endAssignments.length - 3
                  ? handleEndNextClick
                  : null
              }
            ></i>
          </div>
        </div>
        {/* 마감된 과제 리스트 */}
        {curEndAssignments.map((el, idx) => (
          <div className="closed_assignment_contents_container" key={idx}>
            <div className="closed_assignment_contents_title_box">
              <h3 className="closed_assignment_contents_title">{el.title}</h3>
              <span
                className="go_to_closed_assignment_page"
                onClick={() => navigate(`/students/assignmentDetail/${el.id}`)}
              >
                자세히 보기 ⟩
              </span>
            </div>
            <p className="closed_assignment_contents">{el.content}</p>
            <div className="closed_assignment_contents_additional_data_box">
              <p className="">
                <span className="closed_assignment_contents_deadline geen_text">
                  {el.deadline}
                </span>
                &nbsp;까지
              </p>
              <p className="closed_assignment_contents_Participants">
                <span className="closed_assignment_contents_Participants_count geen_text">
                  {el.participants}
                </span>
                &nbsp;명 제출
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignment;
