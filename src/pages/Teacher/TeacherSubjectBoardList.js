import React, {useEffect, useRef, useState} from "react";
import useAxiosGet from "../../hooks/useAxiosGet";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./TeacherSubjectBoardList.css";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";

const TeacherSubjectBoardList = ({ baseUrl }) => {
  const navigate = useNavigate();
  const { "*": subjectId } = useParams();
  const mainSubjectId = subjectId.split("/")[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const pageSize = 15;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const { data: subjectBoardsPage, loading, error } = useAxiosGet(
      `/teachers/subjects/${mainSubjectId}/boards?page=${page}&size=${pageSize}`,
      null
  );

  const { data: mainLectures } = useAxiosGet(`/teachers/subjects/${mainSubjectId}`, null);

  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const [boardForm, setBoardForm] = useState({
    title: "",
    content: "",
    file: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBoardForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < (subjectBoardsPage?.totalPages || 0)) {
      setPage(newPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", boardForm.title);
    formData.append("content", boardForm.content);
    if (boardForm.file) {
      formData.append("file", boardForm.file);
    }

    try {
      await axios.post(`/teachers/subjects/${mainSubjectId}/boards`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      closeModal();
      // 게시물 목록 새로고침
      // TODO: useAxiosGet 훅을 리프레시하는 로직 추가
    } catch (error) {
      console.error("게시물 등록 실패:", error);
      // 에러 처리 로직 추가
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < (subjectBoardsPage?.totalPages || 0); i++) {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data. Please try again.</div>;

  console.log(fileName);

  return (
      <div className="teacher_subject_board_main_container">
        <div className="teacher_subject_board_type_container">
          <img
              className="subject_board_type_image"
              alt="과목이미지"
              src={`${baseUrl}/image/${mainLectures.imagePath}`}
          />
          <div className="teacher_subject_board_description_box">
            <h2 className="teacher_lecture_type_name">{mainLectures.name}</h2>
            <p className="teacher_lecture_type_description">
              {mainLectures.description}
            </p>
          </div>
        </div>

        <div className="teacher_subject_board_main_body_container">
          <h3 className="teacher_subject_board_main_title1">과목 게시판</h3>
          <div className="teacher-subject-register2-container">
            <span className="teacher-subject-register2" onClick={openModal}>게시물 등록</span>
          </div>
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
            {subjectBoardsPage?.content?.map((el, idx) => (
                <tr className="teacher_writed_subject_board_lists" key={el.boardId}>
                  <td>{subjectBoardsPage.totalElements - (page * pageSize + idx)}</td>
                  <td
                      className="teacher_writed_subject_board_title_one"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                          navigate(
                              `/teachers/${mainLectures?.name}/boardDetail/${el.boardId}`,
                              {
                                state: { mainLectures },
                              }
                          )
                      }
                  >
                    {el.title}
                  </td>
                  <td>{el.writer}</td>
                  <td>{new Date(el.writeDate).toLocaleDateString()}</td>
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
                disabled={page === (subjectBoardsPage?.totalPages || 0) - 1}
                className={`teacher_pagination_button ${
                    page === (subjectBoardsPage?.totalPages || 0) - 1 ? "disabled-icon" : ""
                }`}
            >
              <i className="bi bi-chevron-right teacher_pagenation_btn"></i>
            </button>
            <button
                onClick={() => handlePageChange((subjectBoardsPage?.totalPages || 0) - 1)}
                disabled={page === (subjectBoardsPage?.totalPages || 0) - 1}
                className={`teacher_pagination_button ${
                    page === (subjectBoardsPage?.totalPages || 0) - 1 ? "disabled-icon" : ""
                }`}
            >
              <i className="bi bi-chevron-double-right teacher_pagenation_btn"></i>
            </button>
          </div>
        </div>

        {/* Enroll Modal */}
        <TeacherModal isOpen={isModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <div className="teacher-assignment-register-content">
              <span className="teacher_assignment_modalTitle">게시물 등록</span>

              <div className="teacher_assignment_input_group">
                <label>제목</label>
                <input
                    type="text"
                    name="title"
                    value={boardForm.title}
                    onChange={handleInputChange}
                    required
                />
              </div>

              <div className="teacher_assignment_textarea_group">
                <label>내용</label>
                <textarea
                    name="content"
                    value={boardForm.content}
                    onChange={handleInputChange}
                    required
                ></textarea>
              </div>

              <div className="teacher_assignment_file_group">
                <label>파일 첨부</label>
                <div className="teacher-assignment-register-file">
                  <input
                      type="text"
                      className="teacher-lecture-register-filename"
                      value={fileName}
                      readOnly
                      placeholder="선택된 파일 없음"
                  />
                  <button type="button" onClick={handleFileButtonClick}>파일 첨부</button>
                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{display: 'none'}}
                  />
                </div>
              </div>

              <div className="teacher_assignment_modal_buttons">
                <button type="submit" className="teacher_modal_enrollBtn">
                  게시물 등록
                </button>
                <button type="button" className="teacher_modal_cancelBtn" onClick={closeModal}>
                  등록 취소
                </button>
              </div>

      </div>
          </form>
</TeacherModal>
      </div>
  );
};

export default TeacherSubjectBoardList;