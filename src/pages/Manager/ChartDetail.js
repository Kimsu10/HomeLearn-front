import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { Radar } from "react-chartjs-2";
import "chart.js/auto";
import "./ChartDetail.css";

const ChartDetail = () => {
  const { curriculumId, surveyId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState("");
  const [choiceResponses, setChoiceResponses] = useState([]);
  const [textResponses, setTextResponses] = useState([]);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const config = { headers: { access: token } };

        const surveyResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/basic`,
          config
        );
        setSurveyTitle(surveyResponse.data.surveyTitle);

        const choiceResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/choice-response`,
          config
        );

        setChoiceResponses(choiceResponse.data);

        const textResponse = await axios.get(
          `/managers/curriculum/${curriculumId}/survey/${surveyId}/text-response`,
          config
        );

        setTextResponses(textResponse.data.content);
      } catch (error) {
        setError("데이터 가져오기 오류");
        console.error("Error fetching data for ChartDetail:", error);
      }
    };

    fetchData();
  }, [curriculumId, surveyId]);

  if (error) return <div>{error}</div>;
  if (!choiceResponses.length) return <div>로딩 중...</div>;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 3,
        ticks: {
          stepSize: 1,
          display: false,
        },
        pointLabels: {
          font: {
            size: 14,
          },
          color: "#000",
        },
        grid: {
          color: "#ccc",
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw; // 데이터를 가져옵니다.
            return `${value} 명`; // '명'을 추가하여 반환합니다.
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: "#555",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      },
      point: {
        radius: 3,
        backgroundColor: "#fff",
        borderColor: "#000",
      },
    },
  };

  const createRadarData = (choice) => {
    const filteredData = [];
    const labels = ["1", "2", "3", "4", "5"];

    labels.forEach((label, index) => {
      const value = choice.scoreResponseCount[index + 1];
      if (value !== undefined && value !== null) {
        filteredData.push(value);
      }
    });

    return {
      labels: labels.slice(0, filteredData.length),
      datasets: [
        {
          label: "",
          data: filteredData,
          fill: true,
        },
      ],
    };
  };

  return (
    <div className="chart-detail-container">
      <h1 className="chart-survey-title">{surveyTitle}</h1>
      <div className="chart-survey-content">
        <div className="objective-survey">
          <h2>객관식 만족도 조사</h2>
          <div className="radar-charts">
            {choiceResponses.map((choice, index) => (
              <div key={index} className="radar-chart-wrapper">
                <h3>{choice.content}</h3>
                <Radar
                  data={createRadarData(choice, index)}
                  options={radarOptions}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="subjective-survey">
          <h2>주관식 만족도 조사</h2>
          <div className="text-response-section">
            {textResponses && textResponses.length > 0 ? (
              <>
                <h3>소감 및 개선 사항에 대한 의견</h3>
                <div className="text-response-list">
                  {textResponses.slice(0, 6).map((response, index) => (
                    <div key={index} className="text-response-card">
                      <p>{response}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-response-card">주관식 응답이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetail;
