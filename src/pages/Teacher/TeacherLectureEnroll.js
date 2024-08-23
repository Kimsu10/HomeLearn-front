import React, { useState, useEffect } from 'react';
import './TeacherLectureEnroll.css';
import axios from "../../utils/axios";

const TeacherLectureEnroll = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        youtubeLink: "",
        subjectId: "",
    });
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
        }
    }, [isOpen]);

    const getAccessToken = () => {
        return localStorage.getItem('access.token');
    };

    const fetchSubjects = async () => {
        try {
            const token = getAccessToken();
            const response = await axios.get("/side-bar", {
                headers: {
                    'access.token': token
                }
            });
            setSubjects(response.data);
        } catch (error) {
            console.error("과목 목록을 불러오는 데 실패했습니다:", error);
            handleAuthError(error);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = getAccessToken();
            const response = await axios.post("/teachers/lectures", {
                ...formData,
                subjectId: parseInt(formData.subjectId, 10)
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'access.token': token
                }
            });

            if (response.status === 200) {
                alert("강의 등록 성공");
                handleClose();
            }
        } catch (error) {
            console.error("오류 발생:", error);
            handleAuthError(error);
        }
    }

    const handleAuthError = (error) => {
        if (error.response && error.response.status === 401) {
            alert("인증이 만료되었습니다. 다시 로그인해주세요.");
            // 여기에 로그아웃 로직을 추가할 수 있습니다.
        } else if (error.response && error.response.status === 403) {
            alert("권한이 없습니다. 로그인 상태를 확인해주세요.");
        } else {
            alert("오류가 발생했습니다. 다시 시도해주세요");
        }
    }

    const handleClose = () => {
        setFormData({
            title: "",
            description: "",
            youtubeLink: "",
            subjectId: "",
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

    return (
        <div className="teacher-lecture-register">
            <div className="teacher-lecture-register-modal">
                <button className="teacher-lecture-modal-close-button" onClick={handleClose}>×</button>
                <form className="teacher-lecture-register-container" onSubmit={handleSubmit}>
                    <div className="teacher-lecture-register-title">강의 등록</div>
                    <label className="teacher-lecture-register-label">
                        과목
                        <select
                            name="subjectId"
                            value={formData.subjectId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">과목을 선택하세요</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="teacher-lecture-register-label">
                        강의 제목
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="teacher-lecture-register-label2">
                        강의 설명
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </label>
                    <label className="teacher-lecture-register-label">
                        YouTube 링크
                        <input
                            type="text"
                            name="youtubeLink"
                            value={formData.youtubeLink}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="teacher-lecture-register-button">
                        <button type="submit">강의 등록</button>
                        <button type="button" onClick={handleClose}>등록 취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeacherLectureEnroll;