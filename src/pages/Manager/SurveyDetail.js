import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";

const SurveyDetail = () => {
  const { curriculumId, surveyId } = useParams(); // useParams에서 curriculumId와 surveyId를 받아옴

  const [surveyDetails, setSurveyDetails] = useState(null);
  const [curriculumSimple, setCurriculumSimple] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchSurveyDetail = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        // 설문조사 진행 중인 데이터 가져오기
        const surveyResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey-status/progress`,
          config
        );

        // 교육과정 간단 정보 가져오기
        const curriculumResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey-status/curriculum-simple`,
          config
        );

        setSurveyDetails(surveyResponse.data);
        setCurriculumSimple(curriculumResponse.data);
      } catch (error) {
        setError(error.response?.data || "데이터 가져오기 오류");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyDetail();
  }, [curriculumId]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  if (!surveyDetails || !curriculumSimple) {
    return <div>설문조사 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="survey-detail">
      <h2 className="survey-detail-title">
        {curriculumSimple.name} {curriculumSimple.th}기 설문조사
      </h2>
      <h3 className="survey-detail-subtitle">{surveyDetails.title}</h3>
      <div className="survey-cards-container">
        <p>진행중인 설문조사: {surveyDetails.completed} / {surveyDetails.total}</p>
        {/* 설문조사와 관련된 추가적인 정보를 여기서 표시 */}
      </div>
    </div>
  );
};

export default SurveyDetail;
