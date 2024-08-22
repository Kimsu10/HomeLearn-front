import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuestionModal.css";

const QuestionModal = ({
  isOpen,
  closeModal,
  formData,
  setFormData,
  modalName,
  contentTitle,
  contentBody,
  contentFile,
  url,
  submitName,
  cancelName,
  subjects,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("공통");
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  useEffect(() => {
    if (subjects) {
      const subject = subjects.find(
        (subject) => subject.name === selectedSubject
      );
      setSelectedSubjectId(subject ? subject.subjectId : null);
    }
  }, [selectedSubject, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      file: file,
    }));
  };

  const handleFileDelete = () => {
    setFormData((prevState) => ({
      ...prevState,
      file: null,
    }));
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSubjectChange = (value, id) => {
    setSelectedSubject(value);
    setSelectedSubjectId(id);
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("subjectId", selectedSubjectId);
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);

    if (formData.file) {
      submissionData.append("image", formData.file);
    }

    // 확인용 나중에 지우기
    submissionData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    try {
      const response = await axios.post(url, submissionData);

      if (response.status === 200) {
        alert(`${modalName}(이)가 완료!`);
        handleClose();
      }
    } catch (error) {
      console.error(`${modalName} 중 오류 발생:`, error);
      alert(`${modalName}에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      file: null,
    });
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="student_modal show">
      <div className="student_modal_content">
        <span className="subject_modal_close" onClick={handleClose}>
          &times;
        </span>
        <h1 className="student_modal_title">{modalName}</h1>
        <form onSubmit={handleSubmit} className="student_modal_form_body">
          <div className="custom-select-container">
            <div className="custom-select-box" onClick={toggleDropdown}>
              {selectedSubject}
            </div>
            <ul
              className={`custom-select-options ${dropdownOpen ? "open" : ""}`}
            >
              <li key="all" onClick={() => handleSubjectChange("공통", null)}>
                공통
              </li>
              {subjects?.map((subject) => (
                <li
                  key={subject.subjectId}
                  onClick={() =>
                    handleSubjectChange(subject.name, subject.subjectId)
                  }
                >
                  {subject.name}
                </li>
              ))}
            </ul>
          </div>

          {contentTitle && (
            <label>
              <p className="student_modal_name_tag">{contentTitle}</p>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="student_modal_input_title"
              />
            </label>
          )}
          <label>
            <p className="student_modal_name_tag">{contentBody}</p>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="student_modal_input_content"
            ></textarea>
          </label>
          <label className="student_modal_file_label">
            <p className="student_modal_file_tag">{contentFile}</p>
            <div className="student_modal_file_input_wrapper">
              <input
                type="text"
                readOnly
                value={formData.file ? formData.file.name : ""}
                className="student_modal_input_file_display"
              />
              {formData.file && (
                <span className="delete_submit_file" onClick={handleFileDelete}>
                  <i className="bi bi-x-lg"></i>
                </span>
              )}
              <label className="student_modal_file_button">
                {contentFile}
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="student_modal_input_file"
                />
              </label>
            </div>
          </label>
          <div className="student_modal_submit_button_box">
            <button type="submit" className="student_modal_submit_button">
              {submitName}
            </button>
            <button
              type="button"
              className="student_modal_cancel_button"
              onClick={handleClose}
            >
              {cancelName}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionModal;
