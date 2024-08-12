import React from "react";
import PropTypes from "prop-types";
import "./ManagerModal.css";

const ManagerModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="modal-content-body">
          {children}
        </div>
      </div>
    </div>
  );
};

ManagerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ManagerModal;
