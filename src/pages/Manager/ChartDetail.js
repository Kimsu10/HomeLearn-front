import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';
import './ChartDetail.css';

const ChartDetail = () => {
  const { curriculumId, surveyId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [choiceResponses, setChoiceResponses] = useState([]);
  const [textResponses, setTextResponses] = useState([]);
  const [currentTextPage, setCurrentTextPage] = useState(0);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = { headers: { access: token } };

        const surveyResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`, config);
        setSurveyTitle(surveyResponse.data.surveyTitle);

        const choiceResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/choice-response`, config);
        setChoiceResponses(choiceResponse.data);

        const textResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/text-response`, config);
        setTextResponses(textResponse.data.content);

      } catch (error) {
        setError("데이터 가져오기 오류");
        console.error('Error fetching data for ChartDetail:', error);
      }
    };

    fetchData();
  }, [curriculumId, surveyId]);

  if (error) return <div>{error}</div>;
  if (!choiceResponses.length) return <div>로딩 중...</div>;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 1,
        suggestedMax: 5,
        ticks: { stepSize: 1, display: false }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  const createRadarData = (choice) => ({
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      data: [choice.averageScore, choice.averageScore, choice.averageScore, choice.averageScore, choice.averageScore],
      fill: true,
      backgroundColor: "rgba(34, 202, 236, .2)",
      borderColor: "rgba(34, 202, 236, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(34, 202, 236, 1)",
    }]
  });

  return (
    <div className="chart-detail-container">
      <h1 className="survey-title">{surveyTitle}</h1>
      <div className="survey-content">
        <div className="objective-survey">
          <h2>객관식 만족도 조사</h2>
          <div className="radar-charts">
            {choiceResponses.map((choice, index) => (
              <div key={index} className="radar-chart-wrapper">
                <h3>{choice.question}</h3>
                <Radar data={createRadarData(choice)} options={radarOptions} />
              </div>
            ))}
          </div>
        </div>
        <div className="subjective-survey">
          <h2>주관식 만족도 조사</h2>
          <div className="text-response-section">
            {textResponses && textResponses.length > 0 ? (
              <>
                <div className="text-response-card">
                  <h3>소감 및 개선 사항에 대한 의견</h3>
                  <p>{textResponses[currentTextPage]}</p>
                </div>
                <div className="pagination">
                  <button onClick={() => setCurrentTextPage(prev => Math.max(0, prev - 1))} disabled={currentTextPage === 0}>
                    {'<'}
                  </button>
                  <button onClick={() => setCurrentTextPage(prev => Math.min(textResponses.length - 1, prev + 1))} disabled={currentTextPage === textResponses.length - 1}>
                    {'>'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-response-card">주관식 응답이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetail;