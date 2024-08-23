import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";
import "./TeacherQuestionBoard.css";

const TeacherQuestionBoardDetail = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCommentCount, setSelectedCommentCount] = useState("all");
  const pageSize = 15;

  const { data: questionBoards } = useAxiosGet(`/teachers/question-boards`, []);
  const { data: subjects } = useAxiosGet("/side-bar", []);

  const boardContent = questionBoards?.content || [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const splitDate = (date) => {
    return date ? date.slice(0, 10) : "작성일";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < questionBoards?.totalPages) {
      setPage(newPage);
    }
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleCommentCountChange = (event) => {
    setSelectedCommentCount(event.target.value);
  };

  const uniqueCommentCounts = [
    ...new Set(boardContent.map((qb) => qb.commentCount)),
  ];

  const filteredQuestions = boardContent.filter((el) => {
    const subjectMatch =
        selectedSubject === "all" || el.subjectName === selectedSubject;
    const commentMatch =
        selectedCommentCount === "all" ||
        el.commentCount === parseInt(selectedCommentCount);
    return subjectMatch && commentMatch;
  });

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < (questionBoards?.totalPages || 0); i++) {
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
      <div className="teacher_question_board_main_container">
        <div className="teacher_question_board_title_box">
          <h1 className="teacher_question_board_title">질문 게시판</h1>
          <div className="teacher_question_board_filtering_box">
            <select
                className="teacher_search_type_box teacher_question_select_box"
                onChange={handleSubjectChange}
                value={selectedSubject}
            >
              <option value="all">전체</option>
              {subjects?.map((subject) => (
                  <option key={subject.subjectId} value={subject.name}>
                    {subject.name}
                  </option>
              ))}
            </select>
            <select
                className="teacher_question_board_answer_box teacher_question_select_box"
                onChange={handleCommentCountChange}
                value={selectedCommentCount}
            >
              <option value="all">전체</option>
              {uniqueCommentCounts.map((count) => (
                  <option key={count} value={count}>
                    답변 {count}
                  </option>
              ))}
            </select>
          </div>
        </div>
        <table className="teacher_question_board_table">
          <thead>
          <tr>
            <th className="teacher_question_board_number">번호</th>
            <th className="teacher_question_board_subject_">과목명</th>
            <th className="teacher_question_board_writed_title">제목</th>
            <th className="teacher_question_board_writer_name">작성자</th>
            <th className="teacher_question_board_write_date">작성일</th>
            <th>답변수</th>
            <th>답변 여부</th>
          </tr>
          </thead>
          <tbody>
          {filteredQuestions.map((el, idx) => (
              <tr key={idx}>
                <td className="teacher_question_board_number">{idx + 1}</td>
                <td className="teacher_question_board_subject_">
                  {el.subjectName}
                </td>
                <td
                    className="teacher_question_board_writed_title"
                    onClick={() =>
                        navigate(`/teachers/questionBoards/${el.questionBoardId}`)
                    }
                >
                  {el.title}
                </td>
                <td className="teacher_question_board_writer_name">{el.name}</td>
                <td className="teacher_question_board_write_date">
                  {splitDate(el.createDate)}
                </td>
                <td>{el.commentCount}</td>
                <td>
                  {el.commentCount > 0 ? (
                      <i
                          className="bi bi-check-circle-fill"
                          style={{ color: "green" }}
                      ></i>
                  ) : (
                      <i
                          className="bi bi-slash-circle"
                          style={{ color: "red" }}
                      ></i>
                  )}
                </td>
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
              disabled={page === questionBoards?.totalPages - 1}
              className={`teacher_pagination_button ${
                  page === questionBoards?.totalPages - 1 ? "disabled-icon" : ""
              }`}
          >
            <i className="bi bi-chevron-right teacher_pagenation_btn"></i>
          </button>
          <button
              onClick={() => handlePageChange(questionBoards?.totalPages - 1)}
              disabled={page === questionBoards?.totalPages - 1}
              className={`teacher_pagination_button ${
                  page === questionBoards?.totalPages - 1 ? "disabled-icon" : ""
              }`}
          >
            <i className="bi bi-chevron-double-right teacher_pagenation_btn"></i>
          </button>
        </div>
      </div>
  );
};

export default TeacherQuestionBoardDetail;