import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './SurveyDetail.css';

// 필요한 요소들 모두 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const SurveyDetail = () => {
  const { curriculumId } = useParams();
  const [surveyDetails, setSurveyDetails] = useState(null);
  const [curriculumSimple, setCurriculumSimple] = useState(null);
  const [endedSurveys, setEndedSurveys] = useState([]);
  const [surveyTrend, setSurveyTrend] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const token = getToken();
        const config = { headers: { access: token } };

        const [surveyResponse, curriculumResponse, endedSurveysResponse, trendResponse] = await Promise.all([
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/progress`, config),
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/curriculum-simple`, config),
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/end`, config),
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/basic-trend`, config)
        ]);

        setSurveyDetails(surveyResponse.data);
        setCurriculumSimple(curriculumResponse.data);
        setEndedSurveys(endedSurveysResponse.data);
        setSurveyTrend(trendResponse.data);
      } catch (error) {
        setError(error.response?.data || "데이터 가져오기 오류");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [curriculumId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;
  if (!surveyDetails || !curriculumSimple) return <div>설문조사 정보를 불러올 수 없습니다.</div>;

  const barChartData = {
    labels: Object.keys(surveyTrend),
    datasets: [{
      label: '설문 조사 응답 수',
      data: Object.values(surveyTrend),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const lineChartData = {
    labels: Object.keys(surveyTrend),
    datasets: [{
      label: '설문 조사 추이',
      data: Object.values(surveyTrend),
      fill: false,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.1
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...Object.values(surveyTrend)) + 5
      }
    }
  };

  return (
    <div className="survey-detail">
      <div className="survey-detail-title">설문 조사 현황</div>
      <div className="survey-curriculum-title">
        <h3>{curriculumSimple.name} <span>{curriculumSimple.th}기</span></h3>
      </div>
      <div className="survey-card">
        <div className="survey-progress">
          <h4>진행 중인 설문 조사</h4>
          <p>{surveyDetails.title}</p>
          <p className="survey-count">{surveyDetails.completed}/{surveyDetails.total}</p>
          <button className="survey-button">설문 마감</button>
        </div>
        <div className="survey-chart">
          <h4>설문 조사 추이</h4>
          <Bar data={barChartData} options={chartOptions} />
        </div>
        <div className="survey-chart">
          <h4>설문 조사 응답 추이</h4>
          <Line data={lineChartData} options={chartOptions} />
        </div>
      </div>
      <div className="completed-surveys">
        <h3>종료된 설문 조사</h3>
        {endedSurveys.map((survey, index) => (
          <div key={index} className="completed-survey-item">
            <h4>{survey.title}</h4>
            <p>{survey.completed}/{survey.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyDetail;
