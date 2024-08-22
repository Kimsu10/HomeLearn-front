import React, { useState, useRef } from 'react';
import './TeacherLectureRegister.css';
import axios from "axios";

const TeacherLectureRegister = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
    });
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const subjectData = new FormData();
        subjectData.append("name", formData.name);
        subjectData.append("description", formData.description);
        if (formData.image) {
            subjectData.append("image", formData.image);
        }

        try {
            const response = await axios.post("/teachers/subjects", subjectData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                alert("등록 성공");
                window.location.reload();
            }
        } catch (error) {
            console.error("오류 발생:", error);
            alert("다시 시도해주세요");
        }
    }

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            image: null,
        });
        onClose();
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="teacher-lecture-register">
            <div className="teacher-lecture-register-modal">
                <button className="teacher-lecture-modal-close-button" onClick={onClose}>×</button>
                <form className="teacher-lecture-register-container" onSubmit={handleSubmit}>
                    <div className="teacher-lecture-register-title">과목 등록</div>
                    <label className="teacher-lecture-register-label">
                        과목 명
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="teacher-lecture-register-label">
                        설명
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </label>
                    <label className="teacher-lecture-register-label">
                        과목 이미지 첨부
                        <div className="teacher-lecture-register-file">
                            <input
                                type="text"
                                className="teacher-lecture-register-filename"
                                value={formData.image ? formData.image.name : ''}
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
                        <button type="button" onClick={handleClose}>등록 취소</button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default TeacherLectureRegister;