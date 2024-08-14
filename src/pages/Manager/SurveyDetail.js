import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";

const SurveyDetail = () => {
  const { curriculumId, surveyId } = useParams(); // useParams에서 curriculumId와 surveyId를 받아옴

  const [surveyDetails, setSurveyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        // 설문조사 상세 정보 가져오기
        const response = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/detail`,
          config
        );
        setSurveyDetails(response.data);
      } catch (error) {
        setError(error.response?.data || "데이터 가져오기 오류");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [curriculumId, surveyId]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류 발생: {error}</div>;
  }

  if (!surveyDetails) {
    return <div>설문조사 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="survey-detail">
      <h2 className="survey-detail-title">
        {surveyDetails.curriculumName} {surveyDetails.curriculumTh}기 설문조사
      </h2>
      <h3 className="survey-detail-subtitle">{surveyDetails.surveyTitle}</h3>
      <div className="survey-cards-container">
        {/* 설문조사와 관련된 추가적인 정보를 여기서 표시 */}
      </div>
    </div>
  );
};

export default SurveyDetail;
