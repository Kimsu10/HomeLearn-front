import { useEffect, useState } from "react";
import useGetFetch from "../../hooks/useGetFetch";
import "./TeacherAssignmentDetail.css";

const TeacherAssignmentDetail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [clickIdx, setClickIdx] = useState(null);

  const showSubmittedInfo = (index) => {
    setClickIdx(clickIdx === index ? null : index);
  };

  const { data: assignments, error: assginmentsError } = useGetFetch(
    "/data/student/mainLecture/assginmentDetail.json",
    []
  );

  if (assginmentsError) {
    return <div>데이터를 불러오는데 실패하였습니다.</div>;
  }

  return (
    <div className="assignment_detail_main_container">
      <h2 className="teacher_assignment_detail_page_title">과제</h2>
      <div className="teacher_assignment_board_content_box">
        <div className="teacher_assignment_board_title_box">
          <span className="teacher_assignment_title">{assignments?.title}</span>
          <span className="assignment_download_file_name">
            {assignments?.fileName}
          </span>
        </div>
        <div className="teacher_assignment_board_content">
          {assignments?.content}
        </div>
        <div className="teacher_assignment_board_info_box">
          <div className="important_notice_box">
            <span className="teacher_assignment_deadline">
              {assignments?.deadline}
            </span>
            &nbsp;까지 &nbsp;<b>|</b>&nbsp;
            <span>
              미제출&nbsp;
              <span
                className="teacher_assignment_participants_count"
                onClick={() => setIsOpen(!isOpen)}
              >
                {assignments?.nonParticipants?.length || 0}명
                {isOpen && (
                  <div className="non_participants_list_box">
                    {assignments?.nonParticipants?.map((el) => (
                      <p key={el.name} className="non_participants_name">
                        {el.name}
                      </p>
                    ))}
                  </div>
                )}
              </span>
            </span>
          </div>
          <p className="teacher_assignment_board_writed_date">
            {assignments?.writeDate} &nbsp;
            <span style={{ color: "black" }}>작성</span>
          </p>
        </div>
      </div>
      <div className="teacher_assignment_participants_list_container"></div>
      {/* 과목 게시판 리스트들 */}
      <div className="teacher_assignment_participants_container">
        제출 &nbsp;
        <span className="teacher_assignment_participants_count">
          {assignments?.participants?.length || 0}명
        </span>
      </div>
      <div className="subject_board_lists_container">
        {assignments?.participants?.map((participant, idx) => (
          <div
            key={participant.studentId}
            className="subject_board_list_one_box"
          >
            <div className="subject_submitted_lists">
              <p className="submitted_number">{idx + 1}</p>
              <p className="submitted_name">{participant.name}</p>
              <p className="submitted_date">{participant.submittedDate}</p>
              <p
                className="show_more_submitted_info"
                onClick={() => showSubmittedInfo(idx)}
              >
                {clickIdx === idx ? "-" : "+"}
              </p>
            </div>
            {clickIdx === idx && (
              <div className="show_more_submitted_detail_info_container">
                <div className="student_submitted_title_box">
                  <h3 className="teacher_submitted_title">
                    {participant.submitTitle}
                  </h3>
                  <p className="teacher_submitted_file">
                    {participant.fileName}
                  </p>
                </div>
                <p className="teacher_submitted_content">
                  {participant.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAssignmentDetail;
