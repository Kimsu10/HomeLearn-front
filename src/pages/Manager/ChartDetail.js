import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

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

        // 1. 설문조사 제목을 가져옵니다.
        const surveyResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`, config);
        setSurveyTitle(surveyResponse.data.surveyTitle);

        // 2. 선택형 응답 데이터를 가져옵니다.
        const choiceResponse = await axios.get(`/managers/curriculum/${curriculumId}/survey/${surveyId}/choice-response`, config);
        setChoiceResponses(choiceResponse.data);

        // 3. 주관식 응답 데이터를 가져옵니다.
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

  // Radar chart data 설정
  const radarData = {
    labels: choiceResponses.map(choice => choice.question),
    datasets: [
      {
        label: "응답 결과",
        data: choiceResponses.map(choice => choice.averageScore),
        backgroundColor: "rgba(34, 202, 236, .2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h2>{surveyTitle || '설문 제목 없음'}</h2> {/* 데이터가 없을 경우 기본 값 처리 */}
      <Radar data={radarData} />
      <h3>주관식 응답</h3>
      <ul>
        {textResponses && textResponses.length > 0 ? (
          textResponses.map((response, index) => (
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
