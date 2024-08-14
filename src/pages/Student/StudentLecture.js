import { useNavigate, useParams } from "react-router-dom";
import "./StudentLecture.css";
import useGetFetch from "../../hooks/useGetFetch";
import { useEffect } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";

// 과목 상세페이지
const StudentLecture = () => {
  const navigate = useNavigate();
  const subjectId = useParams();
  console.log(subjectId);

  const mainSubjectId = subjectId["*"].split("/")[0];

  console.log(mainSubjectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 강의 영상
  const { data: mainLectures } = useAxiosGet(
    `/students/subjects/${mainSubjectId}`,
    ""
  );

  console.log(mainLectures);
  //"imagePath": "curriculum/ncp/1/subject/37126063-8f24-4aad-b4f9-68f72e0976cc.png" 이걸 못 불러온다.

  // 과목 게시판
  const { data: subjectBoards } = useAxiosGet(
    `/students/subjects/${mainLectures.subjectId}/boards-recent`,
    []
  );

  // 질문 게시판
  const { data: inquiryBoards } = useGetFetch(
    "/data/student/mainLecture/inquiryBoard.json",
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
    <div className="student_lecture_container">
      <div className="main_container">
        <div className="lecutre_type_container">
          <img
            className="lecture_type_image"
            alt="과목이미지"
            src={mainLectures?.imagePath}
          />
          <div className="lecture_description_box">
            <h1 className="lecture_type_name">{mainLectures?.name}</h1>
            <p className="lecture_type_description">
              {mainLectures.description}
            </p>
          </div>
        </div>
        {/* 게시판 */}
        <div className="board_container">
          <div className="lecture_subject_board_container">
            <div className="board_title_box">
              <h3 className="board_title">과목 게시판</h3>
              <span
                className="go_to_show_more_page"
                onClick={() =>
                  navigate(`/students/${mainLectures.name}/board/list`, {
                    state: { mainLectures },
                  })
                }
              >
                더보기 ⟩
              </span>
            </div>
            <div className="subject_list_container">
              {subjectBoards.length === 0 ? (
                <div className="no_subject_boards">
                  작성된 게시글이 없습니다
                </div>
              ) : (
                subjectBoards.slice(0, 4).map((el, idx) => (
                  <div
                    className="subject_list"
                    key={idx}
                    onClick={() =>
                      navigate(
                        `/students/${mainLectures.name}/boardDetail/${el.boardId}`
                      )
                    }
                  >
                    <div className="subject_title_box">
                      <h4 className="subject_title">{el.title}</h4>
                      <span className="subject_write_date">{el.writeDate}</span>
                    </div>
                    <div className="subject_content_box">
                      <span className="subject_text_content">{el.content}</span>
                      <span className="subject_file_name">{el.fileName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="inquiry_board_container">
            <div className="board_title_box">
              <h3 className="board_title">질문 게시판</h3>
              <span
                className="go_to_show_more_page"
                onClick={() => navigate("/students/inquiryBoard")}
              >
                더보기 ⟩
              </span>
            </div>
            <div className="inquiry_list_container">
              {inquiryBoards.slice(0, 4).map((el, idx) => (
                <div
                  className="inquiry_list"
                  key={idx}
                  onClick={() =>
                    navigate(`/students/inquiryDetail/${el.id}`, {
                      state: { mainLectures },
                    })
                  }
                >
                  <div className="inquiry_title_box">
                    <div className="inquiry_type">{el.type}</div>
                    <h4 className="inquiry_list_title">{el.content}</h4>
                    <span className="inquiry_write_date">{el.writeDate}</span>
                  </div>
                  <div className="inquiry_content_box">
                    <span className="inquiry_subject_name">
                      {el.subjectName}
                    </span>
                    <span className="inquiry_text_content">{el.content} </span>
                    <span className="inquiry_file_name">
                      {formatFilePath(el.filePath)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lecture_list_container">
          <div className="lecture_title_box">
            <h3 className="lecture_list_title">강의영상</h3>
            <div className="button_box">
              <button className="left_button non_style_button">⟨</button>
              <button className="right_button non_style_button">⟩</button>
            </div>
          </div>
          <div className="lecture_video_container">
            {mainLectures &&
              mainLectures.lectures &&
              mainLectures.lectures.map((el, idx) => {
                const isOpen = isOpend(el.date);

                return (
                  <div className="lecture_video" key={idx}>
                    <div
                      className={`video_wrapper ${
                        !isOpen ? "not-released" : ""
                      }`}
                    >
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

export default StudentLecture;
