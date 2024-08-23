import { useNavigate, useParams } from "react-router-dom";
import "./TeacherLecture.css";
import { useEffect, useState } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";

const TeacherLecture = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { "*": subjectId } = useParams();
  const mainSubjectId = subjectId.split("/")[0];

  const [subjectBoards, setSubjectBoards] = useState([]);
  const [inquiryBoards, setInquiryBoards] = useState([]);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 과목 기본 정보
  const { data: mainLectures } = useAxiosGet(`/teachers/subjects/${mainSubjectId}`, "");

  // 과목 게시판 최신 4개
  const { data: recentSubjectBoards } = useAxiosGet(`/teachers/subjects/${mainSubjectId}/boards-recent?limit=4`, []);

  // 질문 게시판 최신 4개
  const { data: recentQuestions } = useAxiosGet(`/teachers/subjects/${mainSubjectId}/questions-recent?limit=4`, []);

  // 강의 영상 (페이징)
  const { data: lecturePage } = useAxiosGet(`/teachers/subjects/${mainSubjectId}/lectures?page=0`, {});

  useEffect(() => {
    if (recentSubjectBoards) setSubjectBoards(recentSubjectBoards.slice(0, 4));
    if (recentQuestions) setInquiryBoards(recentQuestions.slice(0, 4));
    if (lecturePage && lecturePage.content) setLectures(lecturePage.content);
  }, [recentSubjectBoards, recentQuestions, lecturePage]);

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
      <div className="teacher_main_container">
        <div className="teacher_lecture_type_container">
          <img
              className="teacher_lecture_type_image"
              alt="과목이미지"
              src={`${baseUrl}/image/${mainLectures?.imagePath}`}
          />
          <div className="teacher_lecture_description_box">
            <h1 className="teacher_lecture_type_name">{mainLectures?.name}</h1>
            <p className="teacher_lecture_type_description">
              {mainLectures?.description}
            </p>
          </div>
        </div>

        <div className="teacher_board_container">
          <div className="teacher_lecture_subject_board_container">
            <div className="teacher_board_title_box">
              <h3 className="teacher_board_title">과목 게시판</h3>
              <span
                  className="teacher_go_to_show_more_page"
                  onClick={() => navigate(`/teachers/${mainLectures?.name}/board/list`)}
              >
              더보기 ⟩
            </span>
            </div>
            <div className="teacher_subject_list_container">
              {subjectBoards.map((el, idx) => (
                  <div
                      className="teacher_subject_list"
                      key={idx}
                      onClick={() => navigate(`/teachers/${mainLectures?.name}/boardDetail/${el.boardId}`)}
                  >
                    <div className="teacher_subject_title_box">
                      <h4 className="teacher_subject_title">{truncateText(el.title, 20)}</h4>
                      <span className="teacher_subject_write_date">{formatDate(el.writeDate)}</span>
                    </div>
                    <div className="teacher_subject_content_box">
                      <span className="teacher_subject_text_content">{truncateText(el.content, 30)}</span>
                      <span className="teacher_subject_file_name">{el.fileName}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div className="teacher_inquiry_board_container">
            <div className="teacher_board_title_box">
              <h3 className="teacher_board_title">질문 게시판</h3>
              <span
                  className="teacher_go_to_show_more_page"
                  onClick={() => navigate("/teachers/questionBoards")}
              >
              더보기 ⟩
            </span>
            </div>
            <div className="teacher_inquiry_list_container">
              {inquiryBoards.map((el, idx) => (
                  <div
                      className="teacher_inquiry_list"
                      key={idx}
                      onClick={() => navigate(`/teachers/questionDetail/${el.questionId}`)}
                  >
                    <div className="teacher_inquiry_title_box">
                      <div className="teacher_inquiry_type">질문</div>
                      <h4 className="teacher_inquiry_list_title">{truncateText(el.title, 20)}</h4>
                      <span className="teacher_inquiry_write_date">{formatDate(el.createdDate)}</span>
                    </div>
                    <div className="teacher_inquiry_content_box">
                  <span className="teacher_inquiry_subject_name">
                    {el.subjectName}
                  </span>
                      <span className="teacher_inquiry_text_content">{truncateText(el.content, 30)}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        <div className="teacher_lecture_playlist_container">
          <div className="teacher_lecture_title_box">
            <h3 className="teacher_lecture_list_title">강의영상</h3>
            <div className="teacher_button_box">
              <button className="non_style_button">⟨</button>
              <button className="non_style_button">⟩</button>
            </div>
          </div>
          <div className="teacher_lecture_video_container">
            {lectures.slice(0, 6).map((el, idx) => (
                <div className="teacher_lecture_video" key={idx}>
                  <div className="teacher_video_wrapper">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getYoutubeEmbedUrl(el.link) + "?enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1"}
                        title={el.title}
                        allowFullScreen
                    ></iframe>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default TeacherLecture;