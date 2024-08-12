import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ManagerCalendar from "../../components/Calendar/ManagerCalendar/ManagerCalendar";
import { CirclePicker } from "react-color";
import "./CurriculumDetail.css";
import swal from "sweetalert";

const CurriculumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [curriculum, setCurriculum] = useState({
    name: "",
    th: 0,
    progress: 0,
  });
  const [attendance, setAttendance] = useState({
    attendance: 0,
    total: 0,
    ratio: 0,
  });
  const [teacher, setTeacher] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [survey, setSurvey] = useState({
    title: "",
    th: "",
    completed: 0,
    total: 0,
  });
  const [isWeekend, setIsWeekend] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [updatedCurriculum, setUpdatedCurriculum] = useState({
    teacherId: "",
    startDate: "",
    endDate: "",
    color: "",
  });
  const [colorWarning, setColorWarning] = useState("");

  const getToken = () => localStorage.getItem("access-token");

  useEffect(() => {
    if (!id) {
      console.error("잘못된 커리큘럼 ID입니다.");
      return;
    }

    const fetchData = async () => {
      try {
        const token = getToken();
        const config = {
          headers: { access: token },
        };

        const basicResponse = await axios.get(
          `/managers/curriculum/${id}/basic`,
          config
        );
        setCurriculum(basicResponse.data);
        setUpdatedCurriculum({
          teacherId: basicResponse.data.teacherId || "",
          startDate: basicResponse.data.startDate || "",
          endDate: basicResponse.data.endDate || "",
          color: basicResponse.data.color || "",
        });

        const teacherResponse = await axios.get(
          `/managers/curriculum/${id}/teacher`,
          config
        );
        if (teacherResponse.data && teacherResponse.data.name) {
          setTeacher(teacherResponse.data);
          setUpdatedCurriculum((prev) => ({
            ...prev,
            teacherId: teacherResponse.data.id || "",
          }));
        } else {
          setTeacher(null);
          setUpdatedCurriculum((prev) => ({
            ...prev,
            teacherId: "",
          }));
        }

        const attendanceResponse = await axios.get(
          `/managers/curriculum/${id}/attendance`,
          config
        );
        setAttendance(attendanceResponse.data);
        setIsWeekend(false);

        const calendarResponse = await axios.get(
          `/managers/curriculum/${id}/calendar`,
          config
        );
        setSchedules(calendarResponse.data);

        const surveyResponse = await axios.get(
          `/managers/curriculum/${id}/survey-status/progress`,
          config
        );
        if (surveyResponse.data) {
          setSurvey({
            id: surveyResponse.data.id,
            title: surveyResponse.data.title,
            th: surveyResponse.data.th,
            completed: surveyResponse.data.completed,
            total: surveyResponse.data.total,
          });
        }
      } catch (error) {
        console.error("데이터 가져오기 오류:", error.response);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCurriculum({ ...updatedCurriculum, [name]: value });
  };

  const handleColorChange = (color) => {
    if (isColorDuplicate(color.hex)) {
      setColorWarning("이 색상은 이미 다른 교육 과정에서 사용 중입니다.");
    } else {
      setColorWarning("");
      setUpdatedCurriculum({ ...updatedCurriculum, color: color.hex });
    }
    setIsColorPickerOpen(false);
  };

  const isColorDuplicate = (newColor) => {
    const existingColors = ["#F3C41E", "#F58D11", "#B85B27"];
    return existingColors.includes(newColor);
  };

  const handleUpdateCurriculum = async () => {
    if (colorWarning) {
      swal("색상 중복 오류", "다른 색상을 선택해 주세요.", "error");
      return;
    }

    try {
      const token = getToken();
      const response = await axios.patch(
        `/managers/manage-curriculums/${id}`,
        updatedCurriculum,
        {
          headers: {
            "Content-Type": "application/json",
            access: token,
          },
        }
      );

      if (response.status === 200) {
        setIsModalOpen(false);
        swal("수정 성공", "교육 과정이 성공적으로 수정되었습니다.", "success");
        const updatedCurriculumResponse = await axios.get(
          `/managers/curriculum/${id}/basic`,
          {
            headers: { access: token },
          }
        );
        setCurriculum(updatedCurriculumResponse.data);
      } else {
        swal("수정 실패", "교육 과정 수정에 실패했습니다. 다시 시도해주세요.", "error");
      }
    } catch (error) {
      console.error("교육 과정 수정 중 오류 발생:", error);
      swal("수정 실패", "교육 과정 수정 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  const handleDeleteCurriculum = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCurriculum = async () => {
    try {
      const token = getToken();
      const passwordCheckResponse = await axios.post(
        "/managers/check-password",
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            access: token,
          },
        }
      );

      if (passwordCheckResponse.status === 200) {
        const deleteResponse = await axios.delete(
          `/managers/manage-curriculums/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              access: token,
            },
          }
        );

        if (deleteResponse.status === 200) {
          swal("삭제 성공", "교육 과정이 성공적으로 삭제되었습니다.", "success");
          navigate("/managers/manage-curriculums");
        } else {
          swal("삭제 실패", "교육 과정 삭제에 실패했습니다. 다시 시도해주세요.", "error");
        }
      } else {
        swal("비밀번호 오류", "비밀번호가 일치하지 않습니다. 다시 시도해주세요.", "error");
      }
    } catch (error) {
      console.error("교육 과정 삭제 중 오류 발생:", error);
      swal("삭제 실패", "교육 과정 삭제 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="curriculum-detail">
      <div className="curriculum-detail-header">
        <h2 className="curriculum-detail-title">교육 과정</h2>
      </div>
      <div className="curriculum-detail-container">
        <div className="curriculum-detail-title-progress-bar">
          <h2 className="curriculum-detail-title">
            {curriculum.name} {curriculum.th}기
          </h2>
          <div className="curriculum-detail-progress-container">
            <span className="curriculum-detail-progress-title">과정 현황</span>
            <div className="curriculum-detail-progress-bar">
              <div
                className="curriculum-detail-progress"
                style={{ width: `${curriculum.progress}%` }}
              ></div>
            </div>
            <span className="curriculum-detail-progress-text">
              {curriculum.progress?.toFixed(1)} / 100%
            </span>
          </div>
        </div>
        <div className="curriculum-detail-content-container">
          <div className="curriculum-detail-left-container">
            <div className="curriculum-detail-info-box">
              <div className="curriculum-detail-info-box-title">
                <span className="curriculum-detail-subtitle">학생 출결 현황</span>
              </div>
              <div className="curriculum-detail-info-box-content">
                {isWeekend ? (
                  <p>휴무일입니다</p>
                ) : (
                  <div className="curriculum-detail-circular-progress">
                    <p className="curriculum-detail-attendance-count">
                      <i className="fas fa-user-graduate"></i>
                      {attendance.attendance} / {attendance.total}
                    </p>
                    <CircularProgressbar
                      value={attendance.ratio}
                      text={`${attendance.ratio}%`}
                    />
                  </div>
                )}
              </div>
              <Link
                to={`/attendance/${id}`}
                className="curriculum-detail-link attendance-link"
              >
                자세히 보기{" "}
              </Link>
            </div>
            <div className="curriculum-detail-info-box">
              <div className="curriculum-detail-info-box-title">
                <span className="curriculum-detail-subtitle">강사 정보</span>
              </div>
              <div className="curriculum-detail-info-box-content-second">
                {teacher && teacher.name ? (
                  <>
                    <p>
                      <i className="fas fa-user"></i> {teacher.name}
                    </p>
                    <p>
                      <i className="fas fa-envelope"></i> {teacher.email}
                    </p>
                    <p>
                      <i className="fas fa-phone"></i> {teacher.phone}
                    </p>
                  </>
                ) : (
                  <p>강사 정보가 없습니다.</p>
                )}
              </div>
              {teacher && teacher.name && (
                <Link to={`/teacher/${id}`} className="curriculum-detail-link teacher-link">
                  자세히 보기{" "}
                </Link>
              )}
            </div>
            <div className="curriculum-detail-info-box curriculum-detail-survey-box">
              <div className="curriculum-detail-survey-header">
                <span className="curriculum-detail-subtitle">설문 조사</span>
                <Link to={`/managers/survey/${id}`} className="survey-link"> {/* 여기에서 경로 수정 */}
                  자세히 보기{" "}
                </Link>
              </div>
              {survey.title ? (
                <div className="curriculum-detail-survey-content">
                  <div className="curriculum-detail-survey-info">
                    <span className="curriculum-detail-survey-th">
                      {curriculum.th}기
                    </span>
                    <span className="curriculum-detail-survey-count">
                      {survey.completed} / {survey.total}
                    </span>
                  </div>
                  <p className="curriculum-detail-survey-name">
                    {survey.title}
                  </p>
                  <div className="curriculum-detail-survey-status">
                    <span className="curriculum-detail-survey-status-text">
                      진행 중
                    </span>
                    <button
                      className="curriculum-detail-survey-button"
                      onClick={() => navigate(`/managers/survey/${survey.id}/detail`)}  // 여기에서 경로 수정
                    >
                      설문 등록
                    </button>
                  </div>
                </div>
              ) : (
                <div className="curriculum-detail-survey-content curriculum-detail-no-survey">
                  <p>진행중인 설문 조사가 없습니다.</p>
                  <button
                    className="curriculum-detail-survey-button"
                    onClick={() => navigate(`/managers/survey/${id}/detail`)}  // 여기에서 경로 수정
                  >
                    설문 등록
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="curriculum-detail-right-container">
            <span className="curriculum-detail-calendar-title">캘린더</span>
            <ManagerCalendar events={schedules} />
          </div>
        </div>
        <div className="curriculum-detail-update-button-container">
          <button
            className="curriculum-detail-update-button"
            onClick={() => setIsModalOpen(true)}
          >
            교육 과정 수정
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="curriculum-modal-title">교육 과정 수정</h2>
            <div className="curriculum-input-group">
              <label>시작일</label>
              <input
                className="curriculum-start-date-input"
                type="date"
                name="startDate"
                value={updatedCurriculum.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="curriculum-input-group">
              <label>종료일</label>
              <input
                className="curriculum-end-date-input"
                type="date"
                name="endDate"
                value={updatedCurriculum.endDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="curriculum-input-group">
              <label>기수 색상</label>
              <div className="color-input-wrapper">
                <input
                  className="color-input"
                  type="text"
                  name="color"
                  value={updatedCurriculum.color}
                  readOnly
                />
                <div
                  className="color-input-select"
                  onClick={() => setIsColorPickerOpen(true)}
                >
                  <div
                    className="color-box"
                    style={{ backgroundColor: updatedCurriculum.color }}
                  ></div>
                </div>
              </div>
              {colorWarning && (
                <p className="color-warning" style={{ color: "red" }}>
                  {colorWarning}
                </p>
              )}
            </div>
            {isColorPickerOpen && (
              <div
                className="color-picker-modal-overlay"
                onClick={() => setIsColorPickerOpen(false)}
              >
                <div
                  className="color-picker-modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CirclePicker
                    color={updatedCurriculum.color}
                    onChangeComplete={handleColorChange}
                    colors={[
                      "#F3C41E", "#F58D11", "#B85B27", "#A90C57",
                      "#F45CE5", "#AE59F0", "#0A8735", "#6F961E",
                      "#19E308", "#1D1AA6", "#20CFF5", "#98B3E5",
                    ]}
                  />
                </div>
              </div>
            )}
            <div className="curriculum-input-group">
              <label>강사</label>
              <select
                name="teacherId"
                value={updatedCurriculum.teacherId}
                onChange={handleInputChange}
                className="teacher-select"
              >
                <option value="">선택 안 함</option>
                {teacher && (
                  <option value={teacher.id}>{teacher.name}</option>
                )}
              </select>
            </div>
            <div className="modal-actions">
              <button className="modal-button" onClick={handleUpdateCurriculum}>
                교육 과정 수정
              </button>
              <button
                className="modal-button delete-button"
                onClick={handleDeleteCurriculum}
              >
                교육 과정 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              ×
            </button>
            <h2 className="delete-modal-title">
              {curriculum.name} {curriculum.th}기 과정을<br />
              삭제하시려면 비밀번호를 입력해 주세요
            </h2>
            <div className="curriculum-input-group">
              <label>비밀번호</label>
              <input
                className="curriculum-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="modal-button delete-button"
                onClick={confirmDeleteCurriculum}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumDetail;
