import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import './Survey.css';

const Survey = () => {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('/managers/dash-boards/survey');
        setSurveys(response.data);
      } catch (error) {
        console.error('설문조사 정보를 가져오는데 실패했습니다.', error);
      }
    };

    fetchSurveys();
  }, []);

  return (
    <div className="setting-list">
      <div className="setting-list-header">
        <h2>설문 조사</h2>
      </div>
      <ul className="survey-list">
        {surveys.map(survey => (
          <li key={survey.id} className="survey-item">
            <div className="survey-info">
              <span className="survey-id">{survey.th}기</span>
              <div className="survey-details">
                <Link to={`/curriculum/${survey.th}/survey/${survey.id}/detail`} className="survey-title-dash">
                  {survey.title}
                </Link>
              </div>
            </div>
            <div className="survey-status">
              <div className="survey-check">{survey.isCompleted ? '완료' : '진행중'}</div>
              <span className="survey-participants">
                <i className="fa-solid fa-user"></i> {survey.participants}/{survey.total}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Survey;
