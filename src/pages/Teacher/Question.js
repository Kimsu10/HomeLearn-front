import React, { useState } from 'react'; // useState 훅-*백 연동할때 useEffect 추가 해야될듯*
import './Question.css';
import {useNavigate} from "react-router-dom";

const Question = () => {
  const [activeButton, setActiveButton] = useState('NCP'); //상태 버튼 변수
  const navigate = useNavigate();
  const handleButtonClick = (buttonName) => {  //버튼 클릭시 상태 업데이트
    setActiveButton(buttonName);
  };

  const lectures = [ // 임시 데이터값 넣어서 화면단 생성 - 백연동 필요
    { id: '질문', title: '오류 문제', date: '2024.08.01', teacher: 'JAVA', th: '404오류 뜨는데요', participants: '답글 달기>' },
    { id: '질문', title: '자바 질문', date: '2024.08.02', teacher: 'JAVA', th: '실행이 안됩니다', participants: '답글 달기>' },
    { id: '질문', title: '리액트 문제질문', date: '2024.08.10', teacher: 'REACT', th: '값을 불러와야되는데 안돼요', participants: '답글 달기>' },
    { id: '질문', title: '자바 질문', date: '2024.08.13', teacher: 'JAVA', th: '라이브러리 사용 질문입니다', participants: '답글 달기>' },
    { id: '질문', title: 'FK 관련 질문', date: '2024.08.15', teacher: 'SQL', th: 'FK 설정이 제대로 안되는것 같습니다', participants: '답글 달기>' }
  ];

  return (
    <div className="question">
      <div className="question-header">
        <h2>질문 게시판</h2>
          <span className="question-view"
                onClick={() => navigate("/teachers/questionBoards")}>
            더보기 >
          </span>
      </div>

      <ul className="question-list">
        {lectures.map((lecture) => (
          <li key={lecture.id} className="question-item">
            <div className="question-info">
              <div className="question-main">
                <span className="question-id">{lecture.id}</span>
                <span className="question-title">{lecture.title}</span>
              </div>
              <span className="question-date">{lecture.date}</span>
            </div>
            <div className="question-details">
              <div className="question-sub">
                <span className="question-subject">{lecture.teacher}</span>
                <span className="question-content">{lecture.th}</span>
              </div>
              <button className="question-participants">{lecture.participants}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
