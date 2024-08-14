import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import "./SurveyForm.css";
import swal from "sweetalert";

const SurveyForm = () => {
  const { surveyId } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const token = localStorage.getItem("access-token");
        const config = {
          headers: { access: token },
        };
        const response = await axios.get(`/students/survey/${surveyId}`, config);

        console.log("Survey Data:", response.data);

        setSurveyData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("설문조사 데이터 가져오기 오류:", error.response);
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);

  const handleInputChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access-token");
      const config = {
        headers: { access: token },
      };
      await axios.post(`/students/survey/${surveyId}`, responses, config);
      swal("제출 성공", "설문 조사 제출 완료", "success");
    } catch (error) {
      console.error("설문조사 제출 오류:", error.response);
    }
  };

  if (loading) return <p>설문조사 데이터를 불러오는 중...</p>;

  if (!surveyData || !surveyData.contents) {
    return <p>설문조사 데이터를 불러오지 못했습니다.</p>;
  }

  return (
    <div className="survey-form">
      <div className="survey-header">
        <h2>설문 조사</h2>
        <h3>{surveyData.title}</h3>
      </div>
      <form onSubmit={handleSubmit}>
        {surveyData.contents.map((question, index) => (
          <div key={index} className="survey-question">
            <p>{index + 1}. {question.content}</p>
            <div className="survey-options">
              {question.type === "RATING" ? (
                <>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="1"
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                    매우 만족
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="2"
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                    만족
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="3"
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                    보통
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="4"
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                    불만족
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value="5"
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                    />
                    매우 불만족
                  </label>
                </>
              ) : question.type === "TEXT" ? (
                <textarea
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                ></textarea>
              ) : null}
            </div>
          </div>
        ))}
        <button type="submit-survey" className="survey-submit-button">설문 제출</button>
      </form>
    </div>
  );
};

export default SurveyForm;
