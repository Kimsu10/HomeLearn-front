import React from "react";
import ReactDOM from "react-dom";
import "./StudentVideoModal.css";
import LectureVideo from "../../../pages/Teacher/play";

const StudentVideoModal = ({ isOpen, onClose, children, url }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="student_video_modal_overlay" onClick={onClose}>
      <div
        className="student_video_modal_content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="student_video_modal_close" onClick={onClose}>
          X
        </button>
        {children}
        {/* <LectureVideo url={url} /> */}
      </div>
    </div>,
    document.body
  );
};

export default StudentVideoModal;
