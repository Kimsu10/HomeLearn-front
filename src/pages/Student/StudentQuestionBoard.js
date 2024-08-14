import { useLocation, useNavigate } from "react-router-dom";
import "./StudentQeustionBoard.css";
import { useEffect, useState } from "react";
import useAxiosGet from "../../hooks/useAxiosGet";

const StudentQuestionBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [page, setPage] = useState(0);
  const pageSize = 15;

  const { data: questionBoards } = useAxiosGet(
    `/students/questions/1/boards?page=${page}&size=${pageSize}`,
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
    if (newPage >= 0 && newPage < questionBoards.totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < questionBoards.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination_button ${i === page ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="question_board_main_container">
      <div className="question_board_type_container">
        <img
          className="question_board_type_image"
          alt="과목이미지"
          src={mainLectures.imgPath}
        />
        <div className="question_board_description_box">
          <h1 className="question_board_type_name">{mainLectures.name}</h1>
          <p className="question_board_type_description">
            {mainLectures.description}
          </p>
        </div>
      </div>
      <div className="question_board_main_body_container">
        <h3 className="question_board_main_title">과목 게시판</h3>
        <table className="question_board_list_table">
          <thead>
            <tr className="question_board_table_tab_names">
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {questionBoards.content?.map((el, idx) => (
              <tr className="writed_question_board_lists" key={el.boardId}>
                <td>
                  {questionBoards.totalElements - (page * pageSize + idx)}
                </td>
                <td
                  className="writed_question_board_title_one"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/students/${mainLectures.name}/BoardDetail/${el.boardId}`,
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
        <div className="pagination_container">
          <button
            onClick={() => handlePageChange(0)}
            disabled={page === 0}
            className={`pagination_button ${page === 0 ? "disabled-icon" : ""}`}
          >
            <i className="bi bi-chevron-double-left pagenation_btn"></i>
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className={`pagination_button ${page === 0 ? "disabled-icon" : ""}`}
          >
            <i className="bi bi-chevron-left pagenation_btn"></i>
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === questionBoards.totalPages - 1}
            className={`pagination_button ${
              page === questionBoards.totalPages - 1 ? "disabled-icon" : ""
            }`}
          >
            <i className="bi bi-chevron-right pagenation_btn"></i>
          </button>
          <button
            onClick={() => handlePageChange(questionBoards.totalPages - 1)}
            disabled={page === questionBoards.totalPages - 1}
            className={`pagination_button ${
              page === questionBoards.totalPages - 1 ? "disabled-icon" : ""
            }`}
          >
            <i className="bi bi-chevron-double-right pagenation_btn"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default StudentQuestionBoard;
