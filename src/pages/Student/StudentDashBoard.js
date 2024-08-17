import React, { useState } from "react";
import "./StudentMain.css";
import RandomVideo from "../../components/Lectures/RandomVideo";
import LectureVideo from "../../components/Lectures/LectureVideo";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import useGetFetch from "../../hooks/useGetFetch";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import StudentModal from "../../components/Modal/StudentModal/StudentModal";
import useAxiosGet from "../../hooks/useAxiosGet";
import TeacherCalendar from "../../components/Calendar/TeacherCalendar/TeacherCalendar";
import ManagerCalendar from "../../components/Calendar/ManagerCalendar/ManagerCalendar";

const StudentDashBoard = () => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [selectedFileName, setSelectedFileName] = useState("");

  // 사이드바에 유저 정보 들어올때까지는 임시로 사용할 유저명
  const username = "ksj";

  // 최근 들은 강의
  const { data: recentLecture } = useAxiosGet(
    `/students/dash-boards/recentLecture`,
    ""
  );
  console.log(recentLecture);

  // 강사가 등록한 일정 & 매니저가 등록한 일정(달력 완성 후)
  const { data: calendarTeacher } = useAxiosGet(
    `/students/dash-boards/calendar/teacher`,
    []
  );
  console.log(calendarTeacher);

  const { data: calendarManager } = useAxiosGet(
    `/students/dash-boards/calendar/manager`,
    []
  );
  console.log(calendarManager);

  // 질의응답
  const { data: question } = useAxiosGet(`/students/dash-boards/questions`, []);
  console.log(question);

  // 과제 목록 GET
  const { data: assignment } = useAxiosGet(`/students/dash-boards/homeworks`);
  console.log(assignment);

  const homeworkId = assignment?.content?.[0]?.homeworkId;
  console.log(homeworkId);

  // 나의 과제 제출 내역 GET
  // const { data: mySubmit } = useAxiosGet(
  //   `/students/homeworks/${homeworkId}/my-submit`
  // );
  // console.log(mySubmit);

  //뱃지(고민)
  const { data: badge } = useAxiosGet("/students/dash-boards/badges", []);
  console.log(badge);

  // 매니저 공지사항
  const { data: adminNotice } = useAxiosGet(
    `students/dash-boards/manager-boards`,
    []
  );
  console.log(adminNotice);

  // 선생님 공지사항
  const { data: teacherNotice } = useAxiosGet(
    `students/dash-boards/teacher-boards`,
    []
  );
  console.log(teacherNotice);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("모달 데이터 : " + formData);
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      handleChange(e);
    }
  };

  return (
    <div className="contents">
      <div className="dashboard_main_container">
        <h1 className="page_title">대시보드</h1>
        <div className="divide_right_container">
          <div className="left_container">
            <div className="recent_lecture_container">
              <div className="title_box">
                <h3 className="components_title">최근 학습 강의</h3>
                <span
                  className="go_to_lecture_page navigate_button"
                  onClick={() =>
                    navigate(`/students/${recentLecture.subject}/board`)
                  }
                >
                  학습 목록 ⟩
                </span>
              </div>
              {/* onClick시에 준명이가 만든 영상 API가 뜨도록해야함 */}
              <div className="recent_contents_box" onClick={() => {}}>
                <h3 className="recent_lecture_type">
                  {recentLecture.subjectName}
                </h3>
                <div className="recent_video_box">
                  <i className="bi bi-play-btn play_recent_video_icon"></i>
                  <p className="recent_lecture_video_title">
                    {recentLecture.title}
                  </p>
                  <div className="recent_lecture_progress_container">
                    <CircularProgressbar
                      value={recentLecture.progress}
                      styles={buildStyles({
                        pathColor: "#A7D7C5",
                        textColor: "#5C8D89",
                        trailColor: "#d6d6d6",
                      })}
                    />
                    <p className="recent_lecture_percentage">
                      {recentLecture.progress}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="video_container">
              <h3 className="components_title">오늘의 IT</h3>
              <div className="random_video_box">
                {/* <RandomVideo width="250" height="240" /> */}
              </div>
              <h3 className="components_title">보충 강의</h3>
              <div className="lecture_video_box">
                {/* <LectureVideo width="250" height="240" /> */}
              </div>
            </div>
            <div className="question_container">
              <div className="title_box">
                <h3 className="components_title">질문사항</h3>
                <span className="go_to_inquiry_page navigate_button">
                  더보기 ⟩
                </span>
              </div>
              <div className="question_list_container">
                {question?.map((el, idx) => (
                  <div
                    className="question_list"
                    key={idx}
                    onClick={() =>
                      navigate(`/students/inquiryBoardDetail/${el.idx}`)
                    }
                  >
                    <div className="question_box">
                      <div className="qusetion_subject_name">
                        {el.lecturName}
                        <span className="question_type_tag">질문</span>
                      </div>
                      <span className="student_question_title">{el.title}</span>
                      <span className="">{el.createdDate}</span>
                    </div>
                    <div className="question_type_box">
                      <span className="question_type_name">
                        {el.subjectName}
                      </span>
                      <span className="question_content">{el.content}</span>
                      <span className="recomment_button">답글 달기 ⟩</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 배지 컨테이너 */}
            <div
              className="badge_container"
              onClick={() => navigate(`/students/${username}/badge`)}
            >
              <div className="title_box">
                <h3 className="components_title">배지</h3>
                <span className="go_to_badge_page navigate_button">
                  더보기 ⟩
                </span>
              </div>
              <div className="badge_list_box">
                {badge.map((el, idx) => (
                  <div className="badge_list" key={idx}>
                    <img
                      src={el.filePath}
                      alt="badge"
                      className="badge_image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 오른쪽 메인 부분 */}
          <div className="right_container">
            <div className="calander-container">
              <h3 className="components_title">캘린더</h3>
              <div className="calander"></div>
            </div>
            <div className="subject_container">
              <div className="title_box">
                <h3 className="components_title"> 과제 목록</h3>
                <span
                  className="go_to_subject_page navigate_button"
                  onClick={() => navigate("/students/assignment")}
                >
                  더보기 ⟩
                </span>
              </div>
              <div className="dashboard_student_assignment_list_container">
                {assignment && assignment?.content?.[0] ? (
                  <div className="dashboard_student_assignment_list_box">
                    <h3 className="student_assignment_sub_title">과제</h3>
                    <h4 className="student_assignment_name">
                      {assignment?.content?.[0]?.title}
                    </h4>
                    <p className="student_assignment_description">
                      {assignment?.content?.[0]?.description}
                    </p>
                    <button
                      className="student_assignment_submit_button"
                      onClick={openModal}
                    >
                      제출하기
                    </button>
                    {/* <div className="show_student_assignment_complete">
                      {el.isSubmit === true ? (
                        <span>
                          제출 여부 <i className="bi bi-check-circle-fill"></i>
                        </span>
                      ) : (
                        <span>
                          제출 여부 <i className="bi bi-x-circle-fill"></i>
                        </span>
                      )} 
                    </div> */}
                    <div className="addtional_info_box">
                      <span className="student_assignment_deadline">
                        ~{assignment?.content?.[0]?.deadLine}
                      </span>
                      <span
                        className="go_to_subject_page"
                        onClick={() =>
                          navigate(`/students/assignmentDetail/${homeworkId}`)
                        }
                      >
                        자세히 보기 ⟩
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="no_student_assignment_box">
                    미제출한 과제가 없습니다.
                  </div>
                )}
              </div>
            </div>
            <div className="notice_container">
              <div className="admin_notice_container">
                <h3 className="notice_components_title">관리자 공지사항</h3>
                {adminNotice.map((el, idx) => (
                  <div className="notice_list" key={idx}>
                    <div className={`notice_type ${el.type}_notice`}>
                      {el.type === "alert" ? "긴급" : "공지"}
                    </div>
                    <div className="notice_title">{el.title}</div>
                    <span className="go_to_admin_notice_page navigate_button">
                      <span className="notice_date">{el.deadLine}</span>
                    </span>
                  </div>
                ))}
                <div className="align_right_box">
                  <span className="go_to_admin_notice_page">자세히 보기 ⟩</span>
                </div>
              </div>
              <div className="teacher_notice_container">
                <h3 className="notice_components_title">선생님 공지사항</h3>
                {teacherNotice.map((el, idx) => (
                  <div key={idx} className="notice_list">
                    <div
                      className={`notice_type ${
                        el.isEmergency ? "emergency_notice" : "regular_notice"
                      }`}
                    >
                      {el.isEmergency ? "긴급" : "공지"}
                    </div>
                    <div className="notice_title">{el.title}</div>
                    <span className="notice_date">{el.createdDate}</span>
                  </div>
                ))}
                <div className="align_right_box">
                  <span className="go_to_admin_notice_page">자세히 보기 ⟩</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default StudentDashBoard;
