import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartDetail = () => {
  const { curriculumId, surveyId } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for ChartDetail with surveyId:', surveyId);
        const token = getToken();
        const config = { headers: { access: token } };
        const response = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`, config);
        console.log('Survey data received:', response.data);
        setSurveyData(response.data);
      } catch (error) {
        setError("데이터 가져오기 오류");
        console.error('Error fetching data for ChartDetail:', error);
      }
    };

    fetchData();
  }, [curriculumId, surveyId]);

  if (error) return <div>{error}</div>;
  if (!surveyData) return <div>로딩 중...</div>;

  const radarData = {
    labels: surveyData.choiceLabels || [], // 데이터가 없을 경우 빈 배열로 처리
    datasets: [
      {
        label: "응답 결과",
        data: surveyData.choiceValues || [], // 데이터가 없을 경우 빈 배열로 처리
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h2>{surveyData.surveyTitle || '설문 제목 없음'}</h2> {/* 데이터가 없을 경우 기본 값 처리 */}
      <Radar data={radarData} />
      <h3>주관식 응답</h3>
      <ul>
        {surveyData.textResponses && surveyData.textResponses.length > 0 ? (
          surveyData.textResponses.map((response, index) => (
            <li key={index}>{response}</li>
          ))
        ) : (
          <li>주관식 응답이 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default ChartDetail;
