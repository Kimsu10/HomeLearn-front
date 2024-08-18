import React, { useEffect, useState } from "react";
import "./StudentMain.css";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import StudentModal from "../../components/Modal/StudentModal/StudentModal";
import RecentVideo from "../../components/Lectures/RecentVideo";
import RecentLectureModal from "../../components/Modal/StudentModal/RecentLectureModal";
import axios from "axios";
import RandomVideo from "../../components/Lectures/RandomVideo";
import LectureVideo from "../../components/Lectures/LectureVideo";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// import ManagerCalendar from "../../components/Calendar/ManagerCalendar/ManagerCalendar";

const StudentDashBoard = ({ username }) => {
  const navigate = useNavigate();
  const [videoDuration, setVideoDuration] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [selectedFileName, setSelectedFileName] = useState("");
  const [recentLecture, setRecentLecture] = useState(null);
  const [calendarManager, setCalendarManager] = useState([]);
  const [question, setQuestion] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [badge, setBadge] = useState([]);
  const [adminNotice, setAdminNotice] = useState([]);
  const [teacherNotice, setTeacherNotice] = useState([]);

  // 임시 변수와 값

  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recentLectureData = await axios.get(
          `/students/dash-boards/recentLecture`
        );
        setRecentLecture(recentLectureData.data);

        // const calendarManagerData = await axios.get(
        //   `/students/dash-boards/calendar/manager`
        // );
        // setCalendarManager(calendarManagerData.data);

        const questionData = await axios.get(`/students/dash-boards/questions`);
        setQuestion(questionData.data);

        const assignmentData = await axios.get(
          `/students/dash-boards/homeworks`
        );
        setAssignment(assignmentData.data);

        const badgeData = await axios.get(`/students/dash-boards/badges`);
        setBadge(badgeData.data);

        const adminNoticeData = await axios.get(
          `/students/dash-boards/manager-boards`
        );
        setAdminNotice(adminNoticeData.data);

        const teacherNoticeData = await axios.get(
          `/students/dash-boards/teacher-boards`
        );
        setTeacherNotice(teacherNoticeData.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const handleDurationFetched = (duration) => {
    setVideoDuration(duration);
  };

  const calculateProgress = () => {
    if (videoDuration && recentLecture && recentLecture.lastPosition) {
      const progress = (
        (recentLecture.lastPosition / videoDuration) *
        100
      ).toFixed(2);
      return parseFloat(progress);
    }
    return 0;
  };

  useEffect(() => {
    if (videoDuration !== null && recentLecture?.lastPosition !== undefined) {
      calculateProgress();
    }
    console.log(videoDuration);
  }, [videoDuration, recentLecture?.lastPosition]);

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
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      handleChange(e);
    }
  };

  const url = recentLecture?.youtubeUrl;

  const YouTubeVideoDuration = ({ youtubeUrl, onDurationFetched }) => {
    useEffect(() => {
      const fetchVideoDuration = async () => {
        if (!youtubeUrl) return;

        try {
          const videoId =
            youtubeUrl.split("v=")[1] || youtubeUrl.split("/").pop();

          const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
              params: {
                part: "contentDetails",
                id: videoId,
                key: process.env.REACT_APP_YOUTUBE_API_KEY,
              },
            }
          );

          if (response.data.items.length > 0) {
            const isoDuration = response.data.items[0].contentDetails.duration;
            const totalSeconds = parseISODuration(isoDuration);
            onDurationFetched(totalSeconds);
          }
        } catch (error) {
          console.error("Error fetching video duration", error);
        }
      };

      fetchVideoDuration();
    }, [youtubeUrl]);

    const parseISODuration = (isoDuration) => {
      const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      if (!match) return 0;

      const hours = parseInt(match[1], 10) || 0;
      const minutes = parseInt(match[2], 10) || 0;
      const seconds = parseInt(match[3], 10) || 0;

      return hours * 3600 + minutes * 60 + seconds;
    };

    return null;
  };

  console.log(url);
  console.log(apiKey);

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
                    navigate(`/students/${recentLecture?.subject}/board`)
                  }
                >
                  학습 목록 ⟩
                </span>
              </div>
              <div className="recent_contents_box" onClick={openModal}>
                <h3 className="recent_lecture_type">
                  {recentLecture?.subjectName}
                </h3>
                {/* 흠.. */}
                <YouTubeVideoDuration
                  youtubeUrl={url}
                  onDurationFetched={handleDurationFetched}
                  apiKey={apiKey}
                />
                <div className="recent_video_box">
                  <i className="bi bi-play-btn play_recent_video_icon"></i>
                  <p className="recent_lecture_video_title">
                    {recentLecture?.title}
                  </p>
                  <div className="recent_lecture_progress_container">
                    <CircularProgressbar
                      value={calculateProgress()}
                      styles={buildStyles({
                        pathColor: "#A7D7C5",
                        textColor: "#5C8D89",
                        trailColor: "#d6d6d6",
                      })}
                    />
                    <p className="recent_lecture_percentage">
                      {calculateProgress()}%
                    </p>
                  </div>
                </div>
              </div>
              <RecentLectureModal isOpen={isModalOpen} onClose={closeModal}>
                <RecentVideo url={url} />
              </RecentLectureModal>
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
                {question.map((el, idx) => (
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
          <div className="right_container">
            <div className="calander-container">
              <h3 className="components_title">캘린더</h3>
              <div className="calander"></div>
            </div>
            <div className="subject_container">
              <div className="title_box">
                <h3 className="components_title">과제 목록</h3>
                <span
                  className="go_to_subject_page navigate_button"
                  onClick={() => navigate("/students/assignment")}
                >
                  더보기 ⟩
                </span>
              </div>
              <div className="dashboard_student_assignment_list_container">
                {assignment.content?.[0] ? (
                  <div className="dashboard_student_assignment_list_box">
                    <h3 className="student_assignment_sub_title">과제</h3>
                    <h4 className="student_assignment_name">
                      {assignment.content[0]?.title}
                    </h4>
                    <p className="student_assignment_description">
                      {assignment.content[0]?.description}
                    </p>
                    <button
                      className="student_assignment_submit_button"
                      onClick={openModal}
                    >
                      제출하기
                    </button>
                    <div className="addtional_info_box">
                      <span className="student_assignment_deadline">
                        ~{assignment.content[0]?.deadLine}
                      </span>
                      <span
                        className="go_to_subject_page"
                        onClick={() =>
                          navigate(
                            `/students/assignmentDetail/${assignment.content[0]?.homeworkId}`
                          )
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
                    <div
                      className={`notice_type ${
                        el.isEmergency ? "emergency_notice" : "regular_notice"
                      }`}
                    >
                      {el.isEmergency ? "긴급" : "공지"}
                    </div>
                    <div className="notice_title">{el.title}</div>
                    <span className="go_to_admin_notice_page navigate_button">
                      <span className="notice_date">{el.createdDate}</span>
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
        selectedFileName={selectedFileName}
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
