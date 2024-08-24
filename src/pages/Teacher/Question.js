import React, { useState, useEffect } from 'react';
import './Question.css';
import { useNavigate } from "react-router-dom";
import useAxiosGet from "../../hooks/useAxiosGet";

const Question = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const { data: questionBoards } = useAxiosGet(`/teachers/question-boards`, []);

  useEffect(() => {
    if (questionBoards && questionBoards.content) {
      const recentQuestions = questionBoards.content.slice(0, 5).map(q => ({
        id: q.questionBoardId,
        title: truncateTitle(q.title, 30),
        date: splitDate(q.createDate),
        teacher: q.subjectName,
        th: q.content.substring(0, 30) + "...",
        participants: `답변 ${q.commentCount}`
      }));
      setQuestions(recentQuestions);
    }
  }, [questionBoards]);

  const splitDate = (date) => {
    return date ? date.slice(0, 10) : "날짜 없음";
  };

  const truncateTitle = (title, maxLength) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  const handleTitleClick = (questionId) => {
    navigate(`/teachers/questionBoards/${questionId}`);
  };

  return (
      <div className="question">
        <div className="question-header">
          <h2>질문 게시판</h2>
          <span className="question-view" onClick={() => navigate("/teachers/questionBoards")}>
          더보기 >
        </span>
        </div>

        <ul className="question-list">
          {questions.map((question) => (
              <li key={question.id} className="question-item">
                <div className="question-info">
                  <div className="question-main">
                    <span className="question-id">질문</span>
                    <span
                        className="question-title"
                        title={question.title}
                        onClick={() => handleTitleClick(question.id)}
                        style={{ cursor: 'pointer' }}
                    >
                  {question.title}
                </span>
                  </div>
                  <span className="question-date">{question.date}</span>
                </div>
                <div className="question-details">
                  <div className="question-sub">
                    <span className="question-subject">{question.teacher}</span>
                    <span className="question-content">{question.th}</span>
                  </div>
                  <button className="question-participants"
                          onClick={() => handleTitleClick(question.id)}>
                    {question.participants}
                  </button>
                </div>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default Question;