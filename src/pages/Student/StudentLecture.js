import { useNavigate, useParams } from "react-router-dom";
import "./StudentLecture.css";
import React, { useState, useEffect } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";

// 과목 상세페이지
const StudentLecture = () => {
  const navigate = useNavigate();
  const { "*": subjectId } = useParams();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const mainSubjectId = subjectId.split("/")[0];

  const [currentPage, setCurrentPage] = useState(0);
  const [lecture, setLecture] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 강의 영상
  const { data: mainLectures } = useAxiosGet(
    `/students/subjects/${mainSubjectId}`,
    ""
  );

  // 과목 게시판
  const { data: subjectBoards = [] } = useAxiosGet(
    `/students/subjects/${mainLectures?.subjectId}/boards-recent`,
    []
  );

  // 질문 게시판
  const { data: inquiryBoards = { content: [] } } = useAxiosGet(
    "/students/question-boards",
    []
  );

  //강의 영상 리스트
  const { data: lectures } = useAxiosGet(`/students/lectures/sub`);
  console.log(lectures);

  useEffect(() => {
    // 현재 페이지에 해당하는 데이터를 설정합니다.
    setLecture(lectures.content);
  }, [currentPage, lectures]);

  const handleLeftButtonClick = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleRightButtonClick = () => {
    if (currentPage < lectures.totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const getYoutubeEmbedUrl = (link) => {
    const videoId = link.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const formatFilePath = (filePath) => {
    if (!filePath) return "";
    const lastDotIndex = filePath.lastIndexOf(".");
    const fileName = filePath.slice(
      Math.max(0, lastDotIndex - 5),
      lastDotIndex
    );
    const fileExtension = filePath.slice(lastDotIndex);
    return `${fileName}${fileExtension}`;
  };

  const splitDate = (date) => {
    return date ? date.slice(0, 10) : "작성일";
  };

  const isMatchedSubjectName = inquiryBoards.content?.some(
    (item) => item.subjectName === mainLectures?.name
  );

  const imgPath = mainLectures?.imagePath;

  return (
    <div className="student_lecture_container">
      <div className="main_container">
        <div className="lecutre_type_container">
          <img
            className="lecture_type_image"
            alt="과목이미지"
            src={`${baseUrl}/image/${imgPath}`}
          />

          <div className="lecture_description_box">
            <h1 className="lecture_type_name">{mainLectures?.name}</h1>
            <p className="lecture_type_description">
              {mainLectures?.description}
            </p>
          </div>
        </div>
        {/* 게시판 */}
        <div className="board_container">
          <div className="lecture_subject_board_container">
            <div className="board_title_box">
              <h3 className="board_title">과목 게시판</h3>
              {subjectBoards.length > 0 && (
                <span
                  className="go_to_show_more_page"
                  onClick={() =>
                    navigate(`/students/${mainLectures?.name}/board/list`, {
                      state: { mainLectures },
                    })
                  }
                >
                  더보기 ⟩
                </span>
              )}
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
                        `/students/${mainLectures?.name}/boardDetail/${el.boardId}`
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
              {isMatchedSubjectName && (
                <span
                  className="go_to_show_more_page"
                  onClick={() =>
                    navigate("/students/questionBoards", {
                      state: { mainLectures },
                    })
                  }
                >
                  더보기 ⟩
                </span>
              )}
            </div>
            {isMatchedSubjectName ? (
              <div className="inquiry_list_container">
                {inquiryBoards.content.slice(0, 4).map((el, idx) => (
                  <div
                    className="inquiry_list"
                    key={idx}
                    onClick={() =>
                      navigate(`/students/questionBoard/${el.questionBoardId}`)
                    }
                  >
                    <div className="inquiry_title_box">
                      <h4 className="inquiry_list_title">{el.title}</h4>
                      <span className="inquiry_write_date">
                        {splitDate(el.createDate)}
                      </span>
                    </div>
                    <div className="inquiry_content_box">
                      <span className="inquiry_subject_name">
                        {el.subjectName}
                      </span>
                      <span className="inquiry_text_content">{el.content}</span>
                      <span className="inquiry_file_name">
                        {formatFilePath(el.filePath)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no_inquiry_container">
                <p className="no_board_list_data">질문 목록이 없습니다.</p>
                <button
                  className="inquiry_submit_button"
                  onClick={() => navigate("/students/questionBoard")}
                >
                  질문하기
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="lecture_list_container">
          <div className="lecture_title_box">
            <h3 className="lecture_list_title">강의영상</h3>
            <div className="button_box">
              <button
                className="left_button non_style_button"
                onClick={handleLeftButtonClick}
                disabled={currentPage === 0}
              >
                ⟨
              </button>
              <button
                className="right_button non_style_button"
                onClick={handleRightButtonClick}
                disabled={currentPage === lectures.totalPages - 1}
              >
                ⟩
              </button>
            </div>
          </div>
          <div className="lecture_video_container">
            {lectures?.content?.map((el, idx) => (
              <div className="lecture_video" key={idx}>
                <iframe
                  width="100%"
                  height="100%"
                  src={
                    getYoutubeEmbedUrl(el.link) +
                    "?enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1"
                  }
                  frameBorder="0"
                  allow="clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={el.title}
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLecture;
