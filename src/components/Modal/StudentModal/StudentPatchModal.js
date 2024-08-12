import React, { useState } from "react";
import axios from "axios";
import "./StudentModal.css";

// studentFreeBoardDetail 처럼 사용.

const StudentPatchModal = ({
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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    file: null,
  });

  const accesstoken = localStorage.getItem("access-token");
  const token = accesstoken ? accesstoken.replace("Bearer ", "") : "";
  // console.log(token);

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
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);

    if (formData.file) {
      submissionData.append("file", formData.file);
    }

    try {
      const response = await axios.patch(url, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          access: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert(`${modalName}(이)가 성공적으로 제출되었습니다!`);
        // handleClose();
        window.location.reload();
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
    setSelectedFileName("");
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="student_modal show">
      <div className="student_modal_content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h1 className="student_modal_title">{modalName}</h1>
        <form onSubmit={handleSubmit} className="student_modal_form_body">
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
          <label>
            <p className="student_modal_content_tag">{contentBody}</p>
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

export default StudentPatchModal;
