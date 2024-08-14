import React, { useState, useRef } from 'react';
import './TeacherLectureRegister.css'; // 스타일 파일을 만들어 import 하세요

const TeacherLectureRegister = ({ onClose }) => {

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };


    return (
        <div className="teacher-lecture-register">
            <div className="teacher-lecture-register-modal">
                <button className="teacher-lecture-modal-close-button" onClick={onClose}>×</button>
                <form className="teacher-lecture-register-container">
                    <div className="teacher-lecture-register-title">과목 등록</div>
                    <label className="teacher-lecture-register-label">
                        과목 명
                        <input type="text" name="subjectName"/>
                    </label>
                    <label className="teacher-lecture-register-label">
                        설명
                        <textarea name="description"></textarea>
                    </label>
                    <label className="teacher-lecture-register-label">
                        과목 이미지 첨부
                        <div className="teacher-lecture-register-file">
                            <input
                                type="text"
                                className="teacher-lecture-register-filename"
                                value={fileName}
                                readOnly
                                placeholder="선택된 파일 없음"
                            />
                            <button type="button" onClick={handleFileButtonClick}>파일첨부</button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{display: 'none'}}
                                accept="image/*"
                            />
                        </div>
                    </label>

                    <div className="teacher-lecture-register-button">
                        <button type="submit">과목 등록</button>
                        <button type="button" onClick={onClose}>등록 취소</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default TeacherLectureRegister;