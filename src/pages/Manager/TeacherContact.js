import React, { useState } from "react";
import "./TeacherContact.css";

const TeacherContact = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      curriculum: "네이버 데브옵스",
      date: "2024.08.26",
      status: "미답변",
      question: "강의 자료 언제 받을 수 있나요?",
      instructor: "대성진",
    },
    {
      id: 2,
      curriculum: "네이버 데브옵스",
      date: "2024.08.26",
      status: "미답변",
      question: "강의 자료 언제 받을 수 있나요?",
      instructor: "성진대",
    },
    {
      id: 3,
      curriculum: "AWS",
      date: "2024.08.26",
      status: "답변 완료",
      question: "강의 자료 언제 받을 수 있나요?",
      instructor: "신수정",
    },
    {
      id: 4,
      curriculum: "AWS",
      date: "2024.08.26",
      status: "답변 완료",
      question: "강의 자료 언제 받을 수 있나요?",
      instructor: "수정신",
    },
  ]);

  const filteredInquiries = inquiries.filter((inquiry) => {
    return (
      (selectedCurriculum === "all" ||
        inquiry.curriculum === selectedCurriculum) &&
      (selectedStatus === "all" || inquiry.status === selectedStatus)
    );
  });

  return (
    <div className="teacher-contact">
      <h2>강사 문의</h2>
      <div className="filter-container">
        <img
          src="/path/to/naver-logo.png"
          alt="Naver"
          className="filter-logo"
          onClick={() => setSelectedCurriculum("네이버 데브옵스")}
        />
        <img
          src="/path/to/aws-logo.png"
          alt="AWS"
          className="filter-logo"
          onClick={() => setSelectedCurriculum("AWS")}
        />
        <select
          className="curriculum-filter"
          onChange={(e) => setSelectedCurriculum(e.target.value)}
        >
          <option value="all">모든 과정</option>
          <option value="네이버 데브옵스">네이버 데브옵스</option>
          <option value="AWS">AWS</option>
        </select>
        <select
          className="status-filter"
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="답변 완료">답변 완료</option>
          <option value="미답변">미답변</option>
        </select>
      </div>
      <div className="inquiries-border">
        <div className="inquiries-container">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`inquiry-card ${
                inquiry.status === "답변 완료" ? "answered" : "unanswered"
              }`}
            >
              <div className="inquiry-header">
                <span className="inquiry-batch">10기</span>
                <span className="inquiry-course">{inquiry.curriculum}</span>
                <i className="fas fa-user"></i>{" "}
                <span className="inquiry-instructor">{inquiry.instructor}</span>
                <i className="fas fa-calendar-alt"></i>{" "}
                <span className="inquiry-date">{inquiry.date}</span>
              </div>
              <div className="inquiry-footer">
                <p className="inquiry-question">{inquiry.question}</p>
                <span
                  className={`inquiry-status ${
                    inquiry.status === "답변 완료"
                      ? "status-answered"
                      : "status-unanswered"
                  }`}
                >
                  {inquiry.status}
                  <i
                    className={`fas fa-${
                      inquiry.status === "답변 완료" ? "check" : "times"
                    }`}
                  ></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherContact;
