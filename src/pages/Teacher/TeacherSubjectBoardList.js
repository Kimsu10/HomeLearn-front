import { useEffect, useState } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";
import { useLocation, useNavigate } from "react-router-dom";
import "./TeacherSubjectBoardList.css";
import useGetFetch from "../../hooks/useGetFetch";

// 과목 게시판
const TeacherSubjectBoardList = ({ baseUrl }) => {
  console.log(baseUrl);
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const pageSize = 15;

  const { data: subjectBoards } = useAxiosGet(
      `/teachers/subjects/1/boards?page=${page}&size=${pageSize}`,
      []
  );

  const mainLectures = location.state?.mainLectures || {
    name: "",
    description: "",
    imagePath: "",
  };

  console.log(mainLectures);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < subjectBoards.totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < subjectBoards.totalPages; i++) {
      pages.push(
          <button
              key={i}
              className={`teacher_pagination_button ${i === page ? "active" : ""}`}
              onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </button>
      );
    }
    return pages;
  };

  return (
      <div className="teacher_subject_board_main_container">
        <div className="teacher_subject_board_type_container">
          <img
              className="teacher_subject_board_type_image"
              alt="과목이미지"
              src={`${baseUrl}/image/${mainLectures.imagePath}`}
          />
          <div className="teacher_subject_board_description_box">
            <h1 className="teacher_subject_board_type_name">{mainLectures.name}</h1>
            <p className="teacher_subject_board_type_description">
              {mainLectures.description}
            </p>
          </div>
        </div>
        <div className="teacher_subject_board_main_body_container">
          <h3 className="teacher_subject_board_main_title">과목 게시판</h3>
          <table className="teacher_subject_board_list_table">
            <thead>
            <tr className="teacher_subject_board_table_tab_names">
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
            </thead>
            <tbody>
            {subjectBoards.content?.map((el, idx) => (
                <tr className="teacher_writed_subject_board_lists" key={el.boardId}>
                  <td>{subjectBoards.totalElements - (page * pageSize + idx)}</td>
                  <td
                      className="teacher_writed_subject_board_title_one"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                          navigate(
                              `/teachers/${mainLectures.name}/BoardDetail/${el.boardId}`,
                              {
                                state: { mainLectures },
                              }
                          )
                      }
                  >
                    {el.title}
                  </td>
                  <td>{el.writer}</td>
                  <td>{el.writeDate}</td>
                  <td>{el.viewCount}</td>
                </tr>
            ))}
            </tbody>
          </table>
          <div className="teacher_pagination_container">
            <button
                onClick={() => handlePageChange(0)}
                disabled={page === 0}
                className={`teacher_pagination_button ${page === 0 ? "disabled-icon" : ""}`}
            >
              <i className="bi bi-chevron-double-left teacher_pagenation_btn"></i>
            </button>
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className={`teacher_pagination_button ${page === 0 ? "disabled-icon" : ""}`}
            >
              <i className="bi bi-chevron-left teacher_pagenation_btn"></i>
            </button>
            {renderPageNumbers()}
            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === subjectBoards.totalPages - 1}
                className={`teacher_pagination_button ${
                    page === subjectBoards.totalPages - 1 ? "disabled-icon" : ""
                }`}
            >
              <i className="bi bi-chevron-right teacher_pagenation_btn"></i>
            </button>
            <button
                onClick={() => handlePageChange(subjectBoards.totalPages - 1)}
                disabled={page === subjectBoards.totalPages - 1}
                className={`teacher_pagination_button ${
                    page === subjectBoards.totalPages - 1 ? "disabled-icon" : ""
                }`}
            >
              <i className="bi bi-chevron-double-right teacher_pagenation_btn"></i>
            </button>
          </div>
        </div>
      </div>
  );
};

export default TeacherSubjectBoardList;