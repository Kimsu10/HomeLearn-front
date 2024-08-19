import { useNavigate } from "react-router-dom";
import "./TeacherLecture.css";
import useGetFetch from "../../hooks/useGetFetch";
import { useEffect } from "react";

const TeacherLecture = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 강의 영상
  const { data: mainLectures } = useGetFetch(
    "/data/teacher/mainLecture/mainLecture.json",
    ""
  );

  console.log(mainLectures);

  // 과목 게시판
  const { data: subjectBoards } = useGetFetch(
    "/data/teacher/mainLecture/subjectBoard.json",
    []
  );

  // 질문 게시판

  const { data: inquiryBoards } = useGetFetch(
    "/data/teacher/mainLecture/inquiryBoard.json",
    []
  );

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatFilePath = (filePath) => {
    const lastDotIndex = filePath.lastIndexOf(".");
    const fileName = filePath.slice(
      Math.max(0, lastDotIndex - 5),
      lastDotIndex
    );

    const fileExtension = filePath.slice(lastDotIndex);
    return `${fileName}${fileExtension}`;
  };

  const today = new Date();

  const isOpend = (dateStr) => {
    const lectureDate = new Date(dateStr);
    return lectureDate <= today;
  };

  const checkDatesUntilOpen = (dateStr) => {
    const lectureDate = new Date(dateStr);
    const leftTime = lectureDate - today;
    return Math.ceil(leftTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="teacher_lecture_container">
      <div className="teacher_main_container">
        <div className="teacher_lecture_type_container">
          <img
            className="teacher_lecture_type_image"
            alt="과목이미지"
            src={mainLectures.imgPath}
          />
          <div className="teacher_lecture_description_box">
            <h1 className="teacher_lecture_type_name">{mainLectures.title}</h1>
            <p className="teacher_lecture_type_description">
              {mainLectures.description}
            </p>
          </div>
        </div>
        {/* 게시판 */}
        <div className="teacher_board_container">
          <div className="teacher_lecture_subject_board_container">
            <div className="teacher_board_title_box">
              <h3 className="teacher_board_title">과목 게시판</h3>
              <span
                className="teacher_go_to_show_more_page"
                onClick={() =>
                  navigate(`/teachers/${mainLectures.title}/boardList`)
                }
              >
                더보기 ⟩
              </span>
            </div>
            <div className="teacher_subject_list_container">
              {subjectBoards.slice(0, 4).map((el, idx) => (
                <div
                  className="teacher_subject_list"
                  key={idx}
                  onClick={() =>
                    navigate(
                      `/teachers/${mainLectures.title}/boardDetail/${el.id}`
                    )
                  }
                >
                  <div className="teacher_subject_title_box">
                    <h4 className="teacher_subject_title">{el.title}</h4>
                    <span className="teacher_subject_write_date">
                      {el.writeDate}
                    </span>
                  </div>
                  <div className="teacher_subject_content_box">
                    <span className="teacher_subject_text_content">
                      {el.content}
                    </span>
                    <span className="teacher_subject_file_name">
                      {el.filePath}
                    </span>
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
                onClick={() => navigate("/students/inquiryBoard")}
              >
                더보기 ⟩
              </span>
            </div>
            <div className="teacher_inquiry_list_container">
              {inquiryBoards.slice(0, 4).map((el, idx) => (
                <div
                  className="teacher_inquiry_list"
                  key={idx}
                  onClick={() => navigate(`/students/inquiryDetail/${el.id}`)}
                >
                  <div className="teacher_inquiry_title_box">
                    <div className="teacher_inquiry_type">{el.type}</div>
                    <h4 className="teacher_inquiry_list_title">{el.content}</h4>
                    <span className="teacher_inquiry_write_date">
                      {el.writeDate}
                    </span>
                  </div>
                  <div className="teacher_inquiry_content_box">
                    <span className="teacher_inquiry_subject_name">
                      {el.subjectName}
                    </span>
                    <span className="teacher_inquiry_text_content">
                      {el.content}{" "}
                    </span>
                    <span className="teacher_inquiry_file_name">
                      {formatFilePath(el.filePath)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="teacher_lecture_list_container">
          <div className="teacher_lecture_title_box">
            <h3 className="teacher_lecture_list_title">강의영상</h3>
            <div className="teacher_button_box">
              <button className="teacher_left_button non_style_button">
                ⟨
              </button>
              <button className="teacher_right_button non_style_button">
                ⟩
              </button>
            </div>
          </div>
          <div className="teacher_lecture_video_container">
            {mainLectures &&
              mainLectures.lectures &&
              mainLectures.lectures.map((el, idx) => {
                const isOpen = isOpend(el.date);
                const daysRemaining = checkDatesUntilOpen(el.date);

                return (
                  <div className="teacher_lecture_video" key={idx}>
                    <div
                      className={`teacher_video_wrapper ${
                        !isOpen ? "not-released" : ""
                      }`}
                    >
                      {/* {!isOpen && (
                        <>
                          <div className="show_not_open">
                            {daysRemaining}일 후 시청 가능합니다.
                          </div>
                          <div className="not-released-overlay"></div>
                        </>
                      )} */}
                      <iframe
                        width="100%"
                        height="100%"
                        src={
                          getYoutubeEmbedUrl(el.links) +
                          "?enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1"
                        }
                        frameBorder="0"
                        allow="clipboard-write; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title={el.title}
                        className={isOpen ? "" : "iframe-container"}
                      ></iframe>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLecture;
