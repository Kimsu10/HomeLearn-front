import React from "react";
import ReactDOM from "react-dom";
import "./RecentLectureModal.css";

const RecentLectureModal = ({ isOpen, onClose, children, url }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="recent_video_modal_overlay" onClick={onClose}>
      <div
        className="recent_video_modal_content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="recent_video_modal_close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default RecentLectureModal;
