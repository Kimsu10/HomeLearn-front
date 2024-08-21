import React, { useState } from "react";
import "./TeacherAssignmentDetail.css";

const TeacherAssignmentDetail = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showNameList, setShowNameList] = useState(false);
  const [isModifyBoxOpen, setIsModifyBoxOpen] = useState(false);

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleCommentChange = (index, value) => {
    setNewComments(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const submitComment = (index) => {
    if (newComments[index]) {
      setComments(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), newComments[index]]
      }));
      setNewComments(prev => ({...prev, [index]: ''}));
    }
  };

  const toggleNameList = (e) => {
    e.preventDefault();
    setShowNameList(!showNameList);
  };

  const handleIconClick = (e) => {
    e.preventDefault();
    setIsModifyBoxOpen(!isModifyBoxOpen);
  };

  const openPatchModal = () => {
    // 수정 모달을 여는 로직을 여기에 구현
    console.log("수정 버튼 클릭");
    setIsModifyBoxOpen(false);
  };

  const handleDelete = () => {
    // 삭제 로직을 여기에 구현
    console.log("삭제 버튼 클릭");
    setIsModifyBoxOpen(false);
  };

  return (
      <div className="assignment_detail_main_container">
        <div className="assignment_title_container">
          <h2 className="teacher_assignment_detail_page_title">과제</h2>
          <i
              className="bi bi-three-dots-vertical show_modify_box_icon"
              onClick={handleIconClick}
          ></i>
          {isModifyBoxOpen && (
              <div className="show_modify_box2">
                <div className="modify_btn" onClick={openPatchModal}>
                  수정
                </div>
                <div className="modify_btn" onClick={handleDelete}>
                  삭제
                </div>
              </div>
          )}
        </div>
        <div className="teacher_assignment_board_content_box">
          <div className="teacher_assignment_board_title_box">
            <span className="teacher_assignment_title">부트 오늘한거</span>
            <span className="assignment_download_file_name">
            boot01.zip
          </span>
          </div>
          <div className="teacher_assignment_board_content">
            querydsl 코드 구현해주세요
          </div>
          <div className="teacher_assignment_board_info_box">
            <div className="important_notice_box">
            <span className="teacher_assignment_deadline">
              2024.07.05 23:59
            </span>
              &nbsp;까지 &nbsp;<b>|</b>&nbsp;
              <span>
              미제출&nbsp;
                <span
                    className="teacher_assignment_participants_count"
                    onClick={toggleNameList}
                    style={{ cursor: 'pointer' }}
                >
                5명
                  {showNameList && (
                      <div className="non_participants_list_box">
                        <p className="non_participants_name">학생1</p>
                        <p className="non_participants_name">학생2</p>
                        <p className="non_participants_name">학생3</p>
                      </div>
                  )}
                </span>
            </span>
            </div>
            <p className="teacher_assignment_board_writed_date">
              2024-07-04 &nbsp;
              <span style={{ color: "black" }}>작성</span>
            </p>
          </div>
        </div>
        <div className="teacher_assignment_participants_list_container"></div>
        <div className="teacher_assignment_participants_container">
          <div>
            제출 &nbsp;
            <span className="teacher_assignment_participants_count">
          10명
              </span>
          </div>
          <button className="teacher_similar_button">유사도 확인</button>



        </div>
        <div className="subject_board_lists_container">
          {[1, 2, 3].map((item, index) => (
              <div key={index} className="subject_board_list_one_box">
                <div className="subject_submitted_lists">
                  <p className="submitted_number">{item}</p>
                  <p className="submitted_name">
                    {index === 0 ? "서준명" : index === 1 ? "김민수" : "이지원"}
                  </p>
                  <p className="submitted_date">
                    {index === 0 ? "2023-12-15" : index === 1 ? "2023-12-16" : "2023-12-17"}
                  </p>
                  <button
                      className="show_more_submitted_info"
                      onClick={() => toggleExpand(index)}
                  >
                    {expandedItems[index] ? '-' : '+'}
                  </button>
                </div>
                {expandedItems[index] && (
                    <div>
                      <div className="show_more_submitted_detail_info_container">
                        <div className="teacher_submitted_title_box">
                          <h3 className="teacher_submitted_title">
                            Spring 과제 제출
                          </h3>
                          <p className="teacher_submitted_file">
                            Spring_Assignment.pdf
                          </p>
                        </div>
                        <p className="teacher_submitted_content">
                          네이버 데브옵스 10기 {index === 0 ? "서준명" : index === 1 ? "김승민" : "정성진"} Spring 과제 제출
                        </p>
                      </div>
                      <div className="show_more_submitted_detail_info_container2">
                        <textarea></textarea>
                        <div className="teacher_detail_content_right">
                          <div className="teacher_detail_date">2024.07.10 23:05</div>
                          <div className="teacher_detail_button_container">
                            <button>피드백 등록</button>
                          </div>
                        </div>
                      </div>
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default TeacherAssignmentDetail;