import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetFetch from "../../hooks/useGetFetch";
import "./StudentQeustionBoard.css";
import useAxiosGet from "../../hooks/useAxiosGet";

const StudentQuestionBoardDetail = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const pageSize = 15;

  const { data: questionBoards } = useAxiosGet(`/students/question-boards`, []);

  const boardContent = questionBoards?.content || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const splitDate = (date) => {
    return date ? date.slice(0, 10) : "작성일";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < questionBoards?.totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < (questionBoards?.totalPages || 0); i++) {
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
    <div className="student_inquiry_board_main_container">
      <div className="student_inquiry_board_title_box">
        <h1 className="student_inquiry_board_title">질문 게시판</h1>
        <div className="student_inquiry_board_filtering_box">
          <select className="search_type_box question_select_box">
            <option value="all" selected>
              전체
            </option>
            <option value="java">JAVA</option>
            <option value="sql">SQL</option>
          </select>
          <select className="inquiry_board_answer_box question_select_box">
            <option value="all" selected>
              답변 0
            </option>
            <option value="java">JAVA</option>
            <option value="sql">SQL</option>
          </select>
        </div>
      </div>
      <table className="student_inquiry_board_table">
        <tr>
          <th>번호</th>
          <th>과목명</th>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일</th>
          <th>답변수</th>
          <th>답변 여부</th>
        </tr>
        {/* 데이터가 존재할 때만 map 함수를 호출 */}
        {boardContent.map((el, idx) => (
          <tr key={idx}>
            <th className="student_inquiry_board_number">{idx + 1}</th>
            <th className="student_inquiry_board_subject_">{el.subjectName}</th>
            <th className="student_inquiry_board_writed_title">{el.title}</th>
            <th className="student_inquiry_board_writer_name">{el.name}</th>
            <th className="student_inquiry_board_write_date">
              {splitDate(el.createDate)}
            </th>
            <th>{el.commentCount}</th>
            <th>
              {el.commentCount > 0 ? (
                <i
                  className="bi bi-check-circle-fill"
                  style={{ color: "green" }}
                ></i>
              ) : (
                <i className="bi bi-slash-circle" style={{ color: "red" }}></i>
              )}
            </th>
          </tr>
        ))}
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
          disabled={page === questionBoards?.totalPages - 1}
          className={`pagination_button ${
            page === questionBoards?.totalPages - 1 ? "disabled-icon" : ""
          }`}
        >
          <i className="bi bi-chevron-right pagenation_btn"></i>
        </button>
        <button
          onClick={() => handlePageChange(questionBoards?.totalPages - 1)}
          disabled={page === questionBoards?.totalPages - 1}
          className={`pagination_button ${
            page === questionBoards?.totalPages - 1 ? "disabled-icon" : ""
          }`}
        >
          <i className="bi bi-chevron-double-right pagenation_btn"></i>
        </button>
      </div>
    </div>
    // </div>
  );
};

export default StudentQuestionBoardDetail;
