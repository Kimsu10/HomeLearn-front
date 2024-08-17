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

  const createRadarData = (choice) => {
    const scoreResponseCount = choice.scoreResponseCount || {};
    const totalResponses = Object.keys(scoreResponseCount).reduce(
      (total, key) => total + (scoreResponseCount[key] || 0),
      0
    );
    const average = totalResponses
      ? Object.keys(scoreResponseCount).reduce(
          (sum, key) => sum + key * scoreResponseCount[key],
          0
        ) / totalResponses
      : 0;

    return {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        label: choice.content,
        data: [
          scoreResponseCount[1] || 0,
          scoreResponseCount[2] || 0,
          scoreResponseCount[3] || 0,
          scoreResponseCount[4] || 0,
          scoreResponseCount[5] || 0,
        ],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }],
    };
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          display: false,
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: "#000",
        },
        grid: {
          color: "#ccc",
        },
      },
    },
    plugins: {
      legend: { display: false }
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        backgroundColor: "#fff",
        borderColor: "#000",
      },
    },
  };

  if (error) return <div>{error}</div>;
  if (!choiceResponses.length) return <div>로딩 중...</div>;

  return (
    <div className="chart-detail-container">
      <h1 className="chart-survey-title">{surveyTitle}</h1>
      <div className="chart-survey-content">
        <div className="objective-survey">
          <h2>객관식 만족도 조사</h2>
          <div className="radar-charts">
            {choiceResponses.map((choice, index) => (
              <div key={index} className="radar-chart-wrapper">
                <h3>{choice.content}</h3>
                <Radar data={createRadarData(choice)} options={radarOptions} />
              </div>
            ))}
          </div>
        </div>
        <div className="subjective-survey">
          <h2>주관식 만족도 조사</h2>
          <div className="text-response-section">
            {textResponses.length > 0 ? (
              <>
                <h3>소감 및 개선 사항에 대한 의견</h3>
                <div className="text-response-list">
                  {textResponses.map((response, index) => (
                    <div key={index} className="text-response-card">
                      <p>{response}</p>
                    </div>
                  ))}
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
