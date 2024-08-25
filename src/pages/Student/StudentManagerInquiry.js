import React, {useEffect, useState} from "react";
import axios from "../../utils/axios";
import './StudentManagerInquiry.css';

const StudentManagerInquiry = () => {
    const [loading, setLoading] = useState(true);
    const [managerInquiry, setManagerInquiry] = useState([]);
    const [filteredInquiries, setFilteredInquiries] = useState([]);
    const [status, setStatus] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailSubmitModalOpen] = useState(false);

    // 문의내역 모달창 요소
    const [inquiryInfo, setInquiryInfo] = useState({
        inquiryId: '',
        curriculumName: '',
        curriculumTh: '',
        name: '',
        title: '',
        createDate: '',
        content: '',
        response: '',
    });

    // 문의 내역 리스트
    const fetchInquiryList = async () => {
        try {
            const response = await axios.get("/students/managers-inquiries");
            if (Array.isArray(response.data)) {
                setManagerInquiry(response.data);
                setFilteredInquiries(response.data);
            } else {
                setManagerInquiry([]);
            }
        } catch (error) {
            console.error("문의내역을 불러올 수 없음", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInquiryList();
    }, [])

    const handleFilter = () => {
        const filtered = managerInquiry.filter((inquiry) => {
            return (
                !status || (status === "답변 완료" && inquiry.response !== null) ||
                (status === "미답변" && inquiry.response === null)
            );
        });
        setFilteredInquiries(filtered);
    }

    // 문의내역 등록 모달
    const handleStudentManagerInquiry = () => {
        setInquiryInfo({
            title:'',
            content: '',
        });
        setIsAddModalOpen(true);
    }

    // 문의 상세내역 모달 요소
    const handleInquiryInfo = (inquiry) => {
        console.log("문의내역 클릭 이벤트 발생", inquiry);
        setInquiryInfo({
            inquiryId: inquiry.inquiryId,
            title: inquiry.title,
            content: inquiry.content,
            createDate: inquiry.createDate,
            name: inquiry.name,
            curriculumName: inquiry.curriculumName,
            curriculumTh: inquiry.curriculumTh,
            response: inquiry.response ? inquiry.response : '',
            responseDate: inquiry.responseDate ? inquiry.responseDate : '',
        });
        setIsDetailSubmitModalOpen(true);
    };

    // 문의 등록 요청
    const fetchSubmitInquiry = async () => {
        try {
            const response = await axios.post("/students/managers-inquiries", inquiryInfo);
            console.log("문의 등록 성공", response.data);
            fetchInquiryList();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error("문의 등록 실패", error);
        }
    }

    // 모달 닫기
    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsDetailSubmitModalOpen(false);
    };

    // FullName 교육과정명 => 변환
    const transformCurriculumName = (curriculumName) => {
        switch (curriculumName) {
            case "네이버 클라우드 데브옵스 과정":
                return "네이버 데브옵스";
            case "AWS 클라우드 자바 웹 개발자 과정":
                return "AWS 자바 웹";
            default:
                return "curriculumName";
        }
    }

    return (
        <div className="stu manager-contact">
            <h1>매니저 문의</h1>
            <div className="stu manager-filter-container">
                <select
                    className="status-filter"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">전체</option>
                    <option value="답변 완료">답변 완료</option>
                    <option value="미답변">미답변</option>
                </select>
                <div className="filter-buttons">
                    <button className="inquiry-submit-button"
                            onClick={handleFilter}>조회
                    </button>
                    {' '}
                    <button className="inquiry-add-button"
                            onClick={handleStudentManagerInquiry}>문의 등록
                    </button>
                </div>
            </div>
            <div className="inquiries-grid">
                <div className="inquiries-column">
                    {filteredInquiries.length > 0 ? (
                        filteredInquiries.map((inquiry) => (
                            <div
                                key={inquiry.inquiryId}
                                className={`inquiry-card ${
                                    inquiry.response ? "answered" : "unanswered"
                                }`}
                                onClick={() => handleInquiryInfo(inquiry)}
                            >
                                <div className="inquiry-header">
                                    <span className="inquiry-batch">{inquiry.curriculumTh}기</span>
                                    <span className="inquiry-course">{transformCurriculumName(inquiry.curriculumName)}</span>
                                    <i className="fas fa-user"></i>
                                    <span className="inquiry-instructor">{inquiry.name}</span>
                                    <i className="fas fa-calendar-alt"></i>
                                    <span className="inquiry-date">{inquiry.createDate}</span>
                                </div>
                                <div className="inquiry-footer">
                                    <p className="inquiry-question">{inquiry.title}</p>
                                    <span
                                        className={`inquiry-status ${
                                            inquiry.response ? "status-answered" : "status-unanswered"
                                        }`}
                                    >
                                        답변 여부
                                        <i
                                            className={`fas fa-${
                                                inquiry.response ? "check-circle" : "times-circle"
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

            {/* 문의 등록 모달 */}
            {isAddModalOpen && (
              <div className="inquiry-manager-modal">
                <div className="inquriy-manager-content">
                    <button className="inquriy-manager-close" onClick={closeModal}>
                        &times;
                    </button>
                    <div className="inquriy-manager-title">
                        <h1>학생 문의 등록</h1>
                        <div className="inquriy-manager-form">
                            <label>제목</label>
                            <input
                                className="inquiry-manager-input"
                                type="text"
                                value={inquiryInfo.title}
                                onChange={(e) =>
                                    setInquiryInfo({...inquiryInfo, title: e.target.value})
                                }
                            />
                            <label>내용</label>
                            <textarea
                                className="inquiry-manager-textarea"
                                value={inquiryInfo.content}
                                onChange={(e) =>
                                    setInquiryInfo({...inquiryInfo, content: e.target.value})
                                }
                            />
                            <div className="inquiry-manager-button-container">
                                <button
                                    onClick={fetchSubmitInquiry}
                                    className="inquiry-manager-submit-button"
                                >
                                    문의 등록
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="inquiry-manager-cancel-button"
                                >
                                    등록 취소
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* 문의 내역 상세확인 모달 */}
            {isDetailModalOpen && inquiryInfo.inquiryId && (
                <div className="inquiry-manager-modal">
                    <div className="inquriy-manager-content">
                        <button className="inquriy-manager-close" onClick={closeModal}>
                            &times;
                        </button>
                        <div className="inquriy-manager-title">
                            <h1>학생 문의 내역</h1>
                            <div className="inquriy-manager-header-row">
                                <p>{transformCurriculumName(inquiryInfo.curriculumName)}</p>
                                <p>{inquiryInfo.curriculumTh}기</p>
                                <p>{inquiryInfo.name}</p>
                            </div>
                            <div className="inquriy-manager-title">
                                <h3>{inquiryInfo.title}</h3>
                                <p>{inquiryInfo.createdDate}</p>
                                <div className="inquriy-manager-content-info">
                                <p>{inquiryInfo.content}</p>
                            </div>
                            <div className="inquiry-manager-answer-section">
                                {inquiryInfo.response && (
                                    <div className="inquiry-response">
                                    <p>{inquiryInfo.response}</p>
                                        <p className="inquiry-manager-response-date">
                                            {inquiryInfo.responseDate}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}
        </div>
    );
}

export default StudentManagerInquiry;