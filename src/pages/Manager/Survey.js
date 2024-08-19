import React from 'react';
import './Survey.css';

const SettingList = () => {
  return (
    <div className="setting-list">
      <div className="setting-list-header">
        <h2>설문 조사</h2>
      </div>
      <ul className="survey-list">
        <li className="survey-item">
          <div className="survey-info">
            <span className="survey-id">1기</span>
            <div className="survey-details">
              <p className="survey-title-dash">네이버 클라우드 데브옵스 <br />만족도 설문조사 1차</p>
            </div>
          </div>
          <div className="survey-status">
            <div className="survey-check">진행중</div>
            <span className="survey-participants"><i className="fa-solid fa-user"></i> 1/2</span>
          </div>
        </li>
        <li className="survey-item">
          <div className="survey-info">
            <span className="survey-id">2기</span>
            <div className="survey-details">
              <p className="survey-title-dash">네이버 클라우드 데브옵스 <br />만족도 설문조사 2차</p>
            </div>
          </div>
          <div className="survey-status">
            <div className="survey-check">완료</div>
            <span className="survey-participants">
                <i className="fas fa-user"></i> 5/5</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SettingList;
