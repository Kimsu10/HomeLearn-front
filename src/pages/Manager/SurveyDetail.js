import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './SurveyDetail.css';
import swal from "sweetalert";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyDetail = () => {
  const { curriculumId } = useParams();
  const navigate = useNavigate(); // navigate 함수 추가
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

  const handleSurveyEnd = async () => {
    try {
      if (!surveyDetails || !surveyDetails.surveyId) {
        swal("등록 실패", "설문 조사 ID를 찾을 수 없습니다.", "warning");
        return;
      }

      const token = getToken();
      const config = { headers: { access: token } };

      console.log("Attempting to end survey with ID:", surveyDetails.surveyId);

      const response = await axios.post(`/managers/manage-curriculums/survey-stop/${surveyDetails.surveyId}`, {}, config);

      if (response.status === 200) {
        const endedSurveysResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey-status/end`, config);
        setEndedSurveys(endedSurveysResponse.data);

        setSurveyDetails(null);
        swal("설문 마감", "설문 조사가 성공적으로 마감되었습니다.", "success");

        navigate(-1); // 이전 페이지로 이동
      } else {
        swal("설문 마감 오류", "설문 마감 중 오류가 발생했습니다.", "error");
      }
    } catch (error) {
      console.error("설문 마감 중 오류 발생:", error);
      swal("등록 실패", "설문 마감 중 오류가 발생했습니다.", "warning");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;
  if (!surveyDetails || !curriculumSimple) return <div>설문조사 정보를 불러올 수 없습니다.</div>;

  const chartData = {
    labels: Object.keys(surveyTrend),
    datasets: [{
      label: '설문 조사 응답 수',
      data: Object.values(surveyTrend),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
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
      <div className="survey-detail-title">
        <h2>{curriculumSimple.name} <span>{curriculumSimple.th}기</span></h2>
      </div>
      <div className="survey-content">
        <div className="left-container">
          <div className="survey-card active-survey">
            <h3>진행 중인 설문 조사</h3>
            <div className="survey-info">
              <p className="survey-info-title">{surveyDetails.title}</p>
              <div className="survey-info-title-right-title">
                <p className="survey-count"> <i className="fa-solid fa-user"></i>{surveyDetails.completed}/{surveyDetails.total}</p>
                <button className="survey-end-button" onClick={handleSurveyEnd}>설문 마감</button>
              </div>
            </div>
          </div>
          <div className="survey-chart">
            <h3>설문 조사 추이</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="right-container">
          <div className="survey-card-end completed-surveys">
            <h3>종료된 설문 조사</h3>
            <div className="completed-surveys-list">
              {endedSurveys.map((survey, index) => (
                <div key={index} className="completed-survey-item">
                  <p>{survey.title}</p>
                  <p className="survey-count">
                    <i className="fa-solid fa-user"></i>{survey.completed}/{survey.total}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;
