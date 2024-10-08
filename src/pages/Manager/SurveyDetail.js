import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../utils/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./SurveyDetail.css";
import swal from "sweetalert";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SurveyDetail = () => {
  const { curriculumId, surveyId } = useParams(); // surveyId를 받을 수 있도록 수정
  const navigate = useNavigate();
  const [surveyDetails, setSurveyDetails] = useState(null);
  const [curriculumSimple, setCurriculumSimple] = useState(null);
  const [endedSurveys, setEndedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const token = getToken();
        const config = { headers: { access: token } };

        const [
          surveyResponse,
          curriculumResponse,
          endedSurveysResponse,
        ] = await Promise.all([
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/progress`, config),
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/curriculum-simple`, config),
          axios.get(`/managers/curriculum/${curriculumId}/survey-status/end`, config),
        ]);

        setSurveyDetails(surveyResponse.data);
        setCurriculumSimple(curriculumResponse.data);
        setEndedSurveys(endedSurveysResponse.data);
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

      const response = await axios.post(
        `/managers/manage-curriculums/survey-stop/${surveyDetails.surveyId}`,
        {},
        config
      );

      if (response.status === 200) {
        const endedSurveysResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey-status/end`,
          config
        );
        setEndedSurveys(endedSurveysResponse.data);

        setSurveyDetails(null);
        swal("설문 마감", "설문 조사가 성공적으로 마감되었습니다.", "success");

        navigate(-1);
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

  // 설문조사가 없는 경우 처리
  if (!surveyDetails) {
    return (
      <div className="survey-detail">
        <div className="survey-detail-title">
          <h2>{curriculumSimple?.name} <span>{curriculumSimple?.th}기</span></h2>
        </div>
        <div className="survey-content">
          <p>진행 중인 설문 조사가 없습니다.</p>
          <div className="survey-card-end completed-surveys">
            <h3>종료된 설문 조사</h3>
            <div className="completed-surveys-list">
              {endedSurveys.length > 0 ? (
                endedSurveys.map((survey, index) => (
                  <div key={index} className="completed-survey-item">
                    <Link to={`/managers/curriculum/${curriculumId}/survey/${survey.surveyId}/basic`} className="survey-info-title">
                      {survey.title}
                    </Link>
                    <p className="survey-count">
                      <i className="fa-solid fa-user"></i>{survey.completed}/{survey.total}
                    </p>
                  </div>
                ))
              ) : (
                <p>종료된 설문 조사가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 설문조사에 응답한 학생 수를 기반으로 데이터를 구성합니다.
  const chartData = {
    labels: [surveyDetails.title], // 설문 제목을 라벨로 사용
    datasets: [
      {
        label: "응답한 학생 수",
        data: [surveyDetails.completed], // 응답한 학생 수를 데이터로 사용
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(surveyDetails.total, surveyDetails.completed) + 1,
        ticks: {
          stepSize: 1, // 정수 단위로 y축 표시
        },
      },
    },
  };

  return (
    <div className="survey-detail">
      <div className="survey-detail-title">
        <h2>
          {curriculumSimple.name} <span>{curriculumSimple.th}기</span>
        </h2>
      </div>
      <div className="survey-content">
        <div className="left-container">
          <div className="survey-card active-survey">
            <h3>진행 중인 설문 조사</h3>
            <div className="survey-info">
              <Link to={`/managers/curriculum/${curriculumId}/survey/${surveyDetails.surveyId}/basic`} className="survey-info-title">
                {surveyDetails.title}
              </Link>
              <div className="survey-info-title-right-title">
                <p className="survey-count">
                  <i className="fa-solid fa-user"></i>
                  {surveyDetails.completed}/{surveyDetails.total}
                </p>
                <button className="survey-end-button" onClick={handleSurveyEnd}>
                  설문 마감
                </button>
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
              {endedSurveys.length > 0 ? (
                endedSurveys.map((survey, index) => (
                  <div key={index} className="completed-survey-item">
                    <Link to={`/managers/curriculum/${curriculumId}/survey/${survey.surveyId}/basic`} className="survey-info-title">
                      {survey.title}
                    </Link>
                    <p className="survey-count">
                      <i className="fa-solid fa-user"></i>
                      {survey.completed}/{survey.total}
                    </p>
                  </div>
                ))
              ) : (
                <p>종료된 설문 조사가 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;
