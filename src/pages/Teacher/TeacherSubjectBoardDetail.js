import "./TeacherSubjectBoardDetail.css";
import { useEffect, useState } from "react";
import useGetFetch from "../../hooks/useGetFetch";
import { useNavigate } from "react-router-dom";
import LectureVideo from "../../components/Lectures/LectureVideo";

const TeacherSubjectBoardDetail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: mainLectures,
    loading: mainLecturesLoading,
    error: mainLecturesError,
  } = useGetFetch("/data/teacher/mainLecture/mainLecture.json", "");

  // 과목 게시판
  const {
    data: subjectBoards,
    loading: subjectBoardsLoading,
    error: subjectBoardsError,
  } = useGetFetch("/data/teacher/mainLecture/subjectBoard.json",[]);


  if (mainLecturesLoading || subjectBoardsLoading) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }

  if (mainLecturesError || subjectBoardsError) {
    return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
  }

  return (
      <div className="subject_board_detail_main_container">
        <div className="teacher_lecture_type_container">
          <img
              className="teacher_lecture_type_image"
              alt="과목이미지"
              src="https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F990AE1505BFEAC2B25"
          />
          <div className="teacher_lecture_description_box">
            <h1 className="teacher_lecture_type_name">{mainLectures.title}</h1>
            <p className="teacher_lecture_type_description">
              {mainLectures.description}
            </p>
          </div>
        </div>
        <h2 className="teacher_subject_board_page_title">과목 게시판</h2>
        {/* 여기부터 과목 게시글 내용 */}
        <div className="teacher_subject_board_title_box">
          <span className="teacher_subject_board_title">1주차 수업 자료.zip</span>
          <span
              className="teacher_subject_board_view_count"
              style={{ fontSize: "24px" }}
          >
          <i className="bi bi-eye teacher_subject_board_view_count_icon"></i>
            &nbsp; 132
        </span>
        </div>
        <div className="teacher_subject_board_body_container">
          <a
              href="/assignment_files/1주차 수업자료.zip"
              download="1주차 수업 자료.zip"
          >
            <p className="teacher_subject_board_download_file_name">
              1주차 수업 자료.zip
            </p>
          </a>
          <p className="teacher_subject_board_content">
            1주차 수업 자료입니다. 미리 다운로드 받으세요! 수업 때 참고 자료로
            사용 예정!
          </p>
          <img
              className="teacher_subject_board_content_image"
              src="https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
          />
        </div>
        <div className="teacher_subject_board_file_register_container">
          <button className="teacher_subject_board_file_register">자료 등록</button>
        </div>
        {/* 과목 게시판 리스트들 */}
        <div className="teacher_subject_board_main_body_container">
          <h3 className="teacher_subject_board_main_title">과목 게시판</h3>
          <table className="teacher_subject_board_list_table">
            <tr className="teacher_subject_board_table_tab_names">
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
            {subjectBoards.slice(0, 5).map((el, idx) => (
                <tr className="teacher_writed_subject_board_lists" key={idx}>
                  <td>{idx + 1}</td>
                  <td
                      className="teacher_writed_subject_board_title_one"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                          navigate(`/teachers/subjectBoardDetail/${el.id}`)
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

export default TeacherSubjectBoardDetail;