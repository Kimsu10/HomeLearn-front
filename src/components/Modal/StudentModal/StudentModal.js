import React, { useState } from "react";
import axios from "axios";
import "./StudentModal.css";
import { useParams } from "react-router-dom";

const StudentModal = ({
  isOpen,
  closeModal,
  modalName,
  contentTitle,
  contentBody,
  contentFile,
  url,
  submitName,
  cancelName,
}) => {
  const { homeworkId } = useParams();

  const [formData, setFormData] = useState({
    homeworkId: homeworkId,
    description: "",
    file: null,
  });

  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file,
    });
    setSelectedFileName(file ? file.name : "");
  };

  const handleFileDelete = () => {
    setFormData({
      ...formData,
      file: null,
    });
    setSelectedFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("homeworkId", formData.homeworkId);
    submissionData.append("description", formData.description);

    if (formData.file) {
      submissionData.append("file", formData.file);
    }

    try {
      const response = await axios.post(url, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert(`${modalName}(이)가 완료!`);
        window.location.reload();
      }
    } catch (error) {
      console.error(`${modalName} 중 오류 발생:`, error);
      alert(`${modalName}에 실패했습니다. 다시 시도해주세요.`);
    }
  };

  const handleClose = () => {
    setFormData({
      homeworkId: "",
      description: "",
      file: null,
    });
    setSelectedFileName("");
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
              name="description"
              value={formData.description}
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
                value={selectedFileName}
                className="student_modal_input_file_display"
              />
              {selectedFileName && (
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

export default StudentModal;
