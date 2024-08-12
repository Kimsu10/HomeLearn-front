import { useEffect, useState } from "react";
import StudentModal from "../../components/Modal/StudentModal/StudentModal";
import "./StudentFreeBoard.css";
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";

const StudentFreeBoard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(15);

  const {
    data: freeboardData,
    loading,
    error,
  } = useAxiosGet(`/students/boards?page=${currentPage}&size=${pageSize}`, {});

  const freeboard = freeboardData.content || [];
  const totalPages = freeboardData.totalPages || 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });
  const [selectedFileName, setSelectedFileName] = useState("");

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
    console.log("모달 데이터 : ", formData);
    closeModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      handleChange(e);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const splitDate = (date) => {
    return date.split("T")[0];
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="main_container">
      <div className="student_freeboard_page_title_box">
        <h1 className="student_freeboard_page_title">자유 게시판</h1>
        <button className="regist_freeboard_writing" onClick={openModal}>
          글 등록
        </button>
      </div>
      {/* 자유 게시판 글 목록 */}
      <table className="student_freeboard_table">
        <thead>
          <tr className="student_freeboard_table_header">
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>답변 수</th>
          </tr>
        </thead>
        <tbody>
          {freeboard.length > 0 ? (
            freeboard.map((el, idx) => (
              <tr className="student_freeboard_table_body" key={el.boardId}>
                <td>{idx + 1 + currentPage * pageSize}</td>
                <td
                  onClick={() => navigate(`/students/freeBoard/${el.boardId}`)}
                >
                  {el.title}
                </td>
                <td>{el.author}</td>
                <td>{splitDate(el.createDate)}</td>
                <td>{el.commentCount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">게시물이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* 페이지네이션  */}
      <div className="freeboard_pagination">
        <button
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
        >
          <i className="bi bi-chevron-double-left"></i>
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={index === currentPage ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          <i className="bi bi-chevron-right"></i>
        </button>
        <button
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          <i className="bi bi-chevron-double-right"></i>
        </button>
      </div>

      <StudentModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        selectedFileName={selectedFileName}
        modalName="게시글 등록"
        contentTitle="제목"
        contentBody="내용"
        contentFile="이미지 첨부"
        url="/students/boards"
        submitName="등록 하기"
        cancelName="등록 취소"
      />
    </div>
  );
};

export default StudentFreeBoard;
