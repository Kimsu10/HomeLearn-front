import { useEffect } from "react";
import "./StudentInquiryBoard.css";
import { useNavigate } from "react-router-dom";
import useGetFetch from "../../hooks/useGetFetch";

const StudentInquiryBoard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: inquiryBoard,

    error: inquiryBoardError,
  } = useGetFetch("/data/student/mainLecture/inquiryBoard.json", []);

  if (inquiryBoardError) {
    return <div>데이터를 불러오는데 오류가 발생했습니다.</div>;
  }

  return (
    <div className="student_inquiry_board_container">
      <div className="student_inquiry_board_main_container">
        <div className="student_inquiry_board_title_box">
          <h1 className="student_inquiry_board_title">질문 게시판</h1>
          <div className="student_inquiry_board_filtering_box">
            <select className="search_type_box">
              <option value="all" selected>
                전체
              </option>
              <option value="java">JAVA</option>
              <option value="sql">SQL</option>
            </select>
            <select className="inquiry_board_answer_box">
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
          {inquiryBoard?.map((el, idx) => (
            <tr key={idx}>
              <th className="student_inquiry_board_number">{idx}</th>
              <th className="student_inquiry_board_subject_">
                {el.subjectName}
              </th>
              <th className="student_inquiry_board_writed_title">{el.title}</th>
              <th className="student_inquiry_board_writer_name">{el.writer}</th>
              <th className="student_inquiry_board_write_date">
                {el.writeDate}
              </th>
              <th>{el.response ? el.response.length : 0}</th>
              <th>
                {el.response && el.response.length > 0 ? (
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
              </th>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};
export default StudentInquiryBoard;
