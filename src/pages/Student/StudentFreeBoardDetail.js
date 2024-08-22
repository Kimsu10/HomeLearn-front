import "./StudentSubjectBoardDetail.css";
import { useEffect, useState } from "react";
import useGetFetch from "../../hooks/useGetFetch";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";

// 과목 게시판상세
const StudentSubjectBoardDetail = ({ baseUrl }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mainLectures = location.state?.mainLectures || {
    name: "",
    description: "",
    imagePath: "",
  };

  const { data: subjectBoardDetail } = useAxiosGet(
    `/students/subjects/1/boards/19`
  );

  const { data: subjectBoards } = useGetFetch(
    "/data/student/mainLecture/subjectBoard.json",
    []
  );

  return (
    <div className="subject_board_detail_main_container">
      <div className="lecutre_type_container">
        <img
          className="subject_board_type_image"
          alt="과목이미지"
          src={`${baseUrl}/image/${mainLectures.imagePath}`}
        />
        <div className="lecture_description_box">
          <h1 className="lecture_type_name">{mainLectures.name}</h1>
          <p className="lecture_type_description">{mainLectures.description}</p>
        </div>
      </div>
      <h2 className="student_subject_board_page_title">과목 게시판</h2>
      {/* 여기부터 과목 게시글 내용 */}
      <div className="student_subject_board_title_box">
        <span className="student_subject_board_title">
          {subjectBoardDetail.title}
        </span>
        <span
          className="student_subject_board_view_count"
          style={{ fontSize: "28px" }}
        >
          <i className="bi bi-eye student_subject_board_view_count_icon"></i>
          &nbsp; {subjectBoardDetail.viewCount}
        </span>
      </div>
      <div className="student_subject_board_body_container">
        <a
          href={subjectBoardDetail.filePath}
          download={subjectBoardDetail.fileName}
        >
          <p className="subject_board_download_file_name">
            {subjectBoardDetail.fileName}
          </p>
        </a>
        <p className="student_subject_board_content">
          {subjectBoardDetail.content}
        </p>
        <img
          className="student_subject_board_content_image"
          src={subjectBoardDetail.filePath}
          alt=""
        />
      </div>
      {/* 과목 게시판 리스트들 */}
      <div className="subject_board_main_body_container">
        <h3 className="subject_board_main_title">과목 게시판</h3>
        <table className="subject_board_list_table">
          <tr className="subject_board_table_tab_names">
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
          {subjectBoards.slice(0, 5).map((el, idx) => (
            <tr className="writed_subject_board_lists" key={idx}>
              <td>{idx + 1}</td>
              <td
                className="writed_subject_board_title_one"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/students/subjectBoardDetail/${el.id}`)
                }
              >
                {el.title}
              </td>
              <td>{el.writer}</td>
              <td>{el.writeDate}</td>
              <td>{el.viewCount}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default StudentSubjectBoardDetail;
