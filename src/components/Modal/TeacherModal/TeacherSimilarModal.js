import React from 'react';
import './TeacherSimilarModal.css'; // 이 CSS 파일을 생성해야 합니다

const TeacherSimilarModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="teacher-similar-modal-overlay">
            <div className="teacher-similar-modal-content">
                <div className="teacher-similar-container">
                    <div className="teacher-similar-content">
                        <div className="teacher-similar-title">유사도 확인</div>
                        <div className="teacher-similar-subtitle">유사도가 90%이상인 그룹이 보여집니다</div>
                    </div>
                    <div className="teacher-similar-content">
                        <div className="teacher-similar-list">서준명 조이현</div>
                        <div className="teacher-similar-list">이지원 박수현</div>
                        <button className="teacher-similar-button" onClick={onClose}>닫기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherSimilarModal;