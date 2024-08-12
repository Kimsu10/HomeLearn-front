import "./StudentSubjectBoardList.css";
import { useEffect } from "react";
import useGetFetch from "../../hooks/useGetFetch";
import { useNavigate } from "react-router-dom";

const StudentSubjectBoardList = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: mainLectures,
    loading: mainLecturesLoading,
    error: mainLecturesError,
  } = useGetFetch("/data/student/mainLecture/mainLecture.json", "");

  const {
    data: subjectBoards,
    loading: subjectBoardsLoading,
    error: subjectBoardsError,
  } = useGetFetch("/data/student/mainLecture/subjectBoard.json", []);

  if (mainLecturesLoading || subjectBoardsLoading) {
    return <div>데이터를 불러오는 중입니다.</div>;
  }

  if (mainLecturesError || subjectBoardsError) {
    return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
  }

  return (
    <div className="subject_board_main_container">
      <div className="subject_board_type_container">
        <img
          className="subject_board_type_image"
          alt="과목이미지"
          src={mainLectures.imgPath}
        />
        <div className="subject_board_description_box">
          <h1 className="subject_board_type_name">{mainLectures.title}</h1>
          <p className="subject_board_type_description">
            {mainLectures.description}
          </p>
        </div>
      </div>
      {/* 게시판 */}
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
          {subjectBoards.map((el, idx) => (
            <tr className="writed_subject_board_lists" key={idx}>
              <td>{idx + 1}</td>
              <td
                className="writed_subject_board_title_one"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(
                    `/students/${mainLectures.title}/BoardDetail/${el.id}`
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
        </table>
      </div>
    </div>
  );
};

export default StudentSubjectBoardList;
