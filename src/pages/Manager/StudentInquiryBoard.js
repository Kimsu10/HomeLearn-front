import React, { useState, useEffect } from 'react';
import axios from "../../utils/axios";
import './InquiryStyle.css';

const StudentInquiryBoard = () => {
    // const [curriculum, setCurriculum] = useState("all");
    // const [status, setStatus] = useState("all");
    const [inquiries, setInquiries] = useState([]);
    const [curriculumName, setCurriculumName] = useState('');
    const [curriculumTh, setCurriculumTh] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        curriculum: '',
        status: '',
        batch: null
    });

    const handleFilterChange = (name, value) => {
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const fetchInquiries = async () => {
        try {
            setError(null);
            setLoading(true);

            const response = await axios.get('/managers/students-inquiries', {
                params: {
                    curriculumName: filters.curriculum && filters.curriculum !== "all"
                    ? filters.curriculum: null,
                    curriculumTh: filters.batch || null
                },
            });
            setInquiries(response.data || []);
        } catch (error) {
            setError("문의 내역을 가져오는데 실패 했습니다");
            console.error("Error fetching inquiries", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInquiries();
    },[filters]);

    return (
        <div className="student-contact">
            <h2>학생 문의</h2>
            <div className="filter-container">
                <img
                    src="/"
                    alt="Naver"
                    className="filter-logo"
                    onClick={(e) => handleFilterChange("curriculum", "네이버 데브옵스")}
                />
                <img
                    src="/"
                    alt="AWS"
                    className="filter-logo"
                    onClick={(e) => handleFilterChange("curriculum", "AWS")}
                />
                <select
                    className="curriculum-filter"
                    onChange={(e) => handleFilterChange("curriculum", e.target.value)}
                >
                    <option value="all">모든 과정</option>
                    <option value="">네이버 데브옵스</option>
                    <option value="">AWS</option>
                </select>
                <select
                    className="status-filter"
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                    <option value="all">전체</option>
                    <option value="답변 완료">답변 완료</option>
                    <option value="미완료">미답변</option>
                </select>
            </div>

            {loading ? (
                <div>로딩중...</div>
            ) : error? (
                <div>{error}</div>
            ) : (
                <div className="inquiries-border">
                  <div className="inquiries-container">
                    {inquiries.length > 0 ? (
                      inquiries.map((inquiry) => (
                        <div
                          key={inquiry.id || inquiry.inquiryId}
                          className={`inquiry-card ${
                          inquiry.status === "답변완료" ? "answered" : "unanswered"
                          }`}
                        >
                          <div className="inquiry-header">
                            <span className="inquiry-batch">{filters.batch || "기수 미지정"}</span>
                            <span className="inquiry-course">{filters.curriculum}</span>
                            <i className="fas fa-user"></i>{" "}
                            <span className="inquiry-instructor">{inquiry.user.name}</span>
                            <i className="fas fa-calendar-alt"></i>{" "}
                            <span className="inquiry-date">{new Date(inquiry.createDate).toLocaleDateString()}</span>
                          </div>
                          <div className="inquiry-footer">
                            <p className="inquiry-question">{inquiry.content}</p>
                            <span
                              className={`inquiry-status ${
                                inquiry.status === "답변완료"
                                  ? "status-answered"
                                  : "status-unanswered"
                              }`}
                            >
                              {inquiry.status}
                              <i
                                className={`fas fa-${
                                inquiry.status === "답변 완료" ? "check" : "times"
                                }`}
                              ></i>
                            </span>
                          </div>
                        </div>
                        ))
                        ) : (
                      <div>문의 내역이 없습니다.</div>
                    )}
                </div>
              </div>
            )}
        </div>
    );
};

export default StudentInquiryBoard;