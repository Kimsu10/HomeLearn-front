import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const SurveyDetail = () => {
  const { curriculumId, surveyId } = useParams();
  const [curriculumAndSurvey, setCurriculumAndSurvey] = useState(null);
  const [choiceStatistics, setChoiceStatistics] = useState([]);
  const [textResponses, setTextResponses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        const basicResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`,
          config
        );
        setCurriculumAndSurvey(basicResponse.data);

        const choiceResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/choice-response`,
          config
        );
        setChoiceStatistics(choiceResponse.data);

        const textResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/text-response?page=${currentPage}`,
          config
        );
        setTextResponses(textResponse.data.content);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error.response);
      }
    };

    fetchData();
  }, [curriculumId, surveyId, currentPage]);

  const radarData = {
    labels: choiceStatistics.map(stat => stat.question),
    datasets: [
      {
        label: '평균 점수',
        data: choiceStatistics.map(stat => stat.averageScore),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="survey-detail">
      <h2 className="survey-detail-title">
        {curriculumAndSurvey?.curriculumName} {curriculumAndSurvey?.curriculumTh}기 설문조사
      </h2>
      <h3 className="survey-detail-subtitle">
        {curriculumAndSurvey?.surveyTitle}
      </h3>

      <div className="survey-cards-container">
        <div className="survey-card">
          <div className="survey-card-title">진행 중인 설문 조사</div>
          {/* 여기서 진행 중인 설문을 맵핑하여 목록을 보여줄 수 있습니다 */}
        </div>
        <div className="survey-card">
          <div className="survey-card-title">종료된 설문 조사</div>
          {/* 여기서 완료된 설문을 맵핑하여 목록을 보여줄 수 있습니다 */}
        </div>
        <div className="survey-card survey-trend-card">
          <div className="survey-card-title">설문 조사 추이</div>
          <Radar data={radarData} />
        </div>
      </div>

      <div className="text-responses">
        <h4>주관식 응답</h4>
        {textResponses.map((response, index) => (
          <p key={index} className="text-response">{response}</p>
        ))}
        <div className="pagination-buttons">
          <button onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}>이전</button>
          <button onClick={() => setCurrentPage(prev => prev + 1)}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default SurveyDetail;
