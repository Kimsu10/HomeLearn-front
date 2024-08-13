import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from "react-chartjs-2";

const SurveyDetail = () => {
  const { curriculumId, surveyId } = useParams();  // useParams로 전달된 curriculumId와 surveyId를 받아옴

  console.log('Received curriculumId:', curriculumId);
  console.log('Received surveyId:', surveyId);

  const [curriculumAndSurvey, setCurriculumAndSurvey] = useState(null);
  const [choiceStatistics, setChoiceStatistics] = useState([]);
  const [textResponses, setTextResponses] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        console.log("Access Token:", token);

        const config = {
          headers: { access: token },
        };

        // Curriculum and Survey data fetch
        const basicResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`,
          config
        );
        console.log("Basic Response Data:", basicResponse.data);
        setCurriculumAndSurvey(basicResponse.data);

        // Choice Statistics data fetch
        const choiceResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/choice-response`,
          config
        );
        console.log("Choice Statistics Response Data:", choiceResponse.data);
        setChoiceStatistics(choiceResponse.data);

        // Text Responses data fetch
        const textResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/text-response?page=${currentPage}`,
          config
        );
        console.log("Text Responses Data:", textResponse.data.content);
        setTextResponses(textResponse.data.content);

        setIsLoading(false); // 로딩 완료
      } catch (error) {
        console.error("데이터 가져오기 오류:", error.response);
        setIsLoading(false); // 오류가 발생한 경우에도 로딩 완료 처리
      }
    };

    fetchData();
  }, [curriculumId, surveyId, currentPage]);

  if (isLoading) {
    console.log("Loading...");
    return <div>로딩 중...</div>;
  }

  if (!curriculumAndSurvey) {
    console.log("Failed to load data.");
    return <div>데이터를 가져오지 못했습니다.</div>;
  }

  return (
    <div className="survey-detail">
      <h2 className="survey-detail-title">
        {curriculumAndSurvey.curriculumName} {curriculumAndSurvey.curriculumTh}기 설문조사
      </h2>
      <h3 className="survey-detail-subtitle">
        {curriculumAndSurvey.surveyTitle}
      </h3>
      <div className="survey-cards-container">
      </div>
    </div>
  );
};

export default SurveyDetail;
