import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import TeacherModal from "../../components/Modal/TeacherModal/TeacherModal";
import Pagination from "./Pagination";
import "./TeacherNotice.css";

function TeacherNotice() {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;
    const [expandedNoticeId, setExpandedNoticeId] = useState(null);

    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [checkSelect, setCheckSelect] = useState([]);
    const [currentNotice, setCurrentNotice] = useState({
        noticeTitle: '',
        noticeContent: '',
        noticeType: '공지',
        noticeFile: null,
    });

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await axios.get("/teachers/notification-boards", {
                    params: {
                        page: currentPage,
                        size: pageSize
                    }
                });
                const { content, totalPages } = response.data;
                setNotices(content);
                setTotalPages(totalPages);
                return response.data;
            } catch(error) {
                console.log("Error fetching Teacher notices", error);
            }
        };
        fetchNotice();
    }, [currentPage, pageSize]);

    const handleSaveNotice = async () => {
        const formData = new FormData();
        formData.append("title", currentNotice.noticeTitle);
        formData.append("content", currentNotice.noticeContent);
        formData.append("isEmergency", currentNotice.noticeType === '긴급');
        if(currentNotice.noticeFile) {
            formData.append("file", currentNotice.noticeFile);
        }

        try {
            console.log("Saving notice..", formData);
            await axios.post("/teachers/notification-boards", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log("Notice saved successfully");
            setCurrentPage(0); // 첫 페이지 이동
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error Saving Teacher notice", error);
        }
    };

    const handleDeleteNotices = async () => {
        try {
            await axios.delete("/teachers/notification-boards", {
                data: { boardIds: checkSelect },
            });
            setCheckSelect([]);
            setCurrentPage(0);
        } catch (error) {
            console.error("Error Deleting Teacher notices", error);
        }
    };

    const handleOpenModal = (notice = null) => {
        setCurrentNotice(notice || {
            noticeTitle: '',
            noticeContent: '',
            noticeType: '',
            noticeFile: null,
        });
        setIsModalOpen(true); // 모달 열기
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
    }

    const handleCheckboxChange = (noticeId) => {
        setCheckSelect((prev) =>
        prev.includes(noticeId) ? prev.filter((id) => id !== noticeId) : [...prev, noticeId]);
    };

    const handleToggleNotice = (noticeId) => {
        setExpandedNoticeId(expandedNoticeId === noticeId ? null : noticeId);
    }


    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setCurrentNotice((prev) => ({
    //             ...prev,
    //             noticeFile: file,
    //         }));
    //     }
    // };
    //
    // const handleFileDelete = () => {
    //     setCurrentNotice((prev) => ({
    //         ...prev,
    //         noticeFile: '',
    //     }));
    // };
    //
    // const handleNoticeChange = (e) => {
    //     const { name, value } = e.target;
    //     setCurrentNotice((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h1>공지사항</h1>
                <div className="notice-actions">
                    <button className="notice-action-button" onClick={() => handleOpenModal()}>등록</button>
                    <button className="notice-action-button" onClick={handleDeleteNotices}>삭제</button>
                </div>
            </div>

            { notices.map((notice) => (
                <div key={notice.noticeId} className="notice-item">
                    <div className="notice-summary">
                        <input
                            type="checkbox"
                            checked={checkSelect.includes(notice.noticeId)}
                            onChange={() => handleCheckboxChange(notice.noticeId)}
                        />
                        <span
                            className={`notice-type ${notice.isEmergency ? 'urgent' : 'normal'}`}>{notice.noticeType}</span>
                        <div className="notice-title-date">
                            <span className="notice-title">{notice.noticeTitle}</span>
                            <span className="notice-date">{notice.noticeDate}</span>
                        </div>
                        <button className="notice-toggle-button" onClick={() =>
                            handleToggleNotice(notice.noticeId)}>{expandedNoticeId === notice.noticeId ? '-' : '+'}
                        </button>
                    </div>
                    { expandedNoticeId === notice.noticeId && (
                        <div className="notice-content">
                            <button className="notice-edit-button" onClick={() => handleOpenModal(notice)}>수정</button>
                            <p>{ notice.noticeContent }</p>
                            {notice.noticeFile && <div className="notice-footer">
                                <span>{notice.noticeFile}</span>
                            </div>}
                        </div>
                    )}
                </div>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            <TeacherModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2>공지사항 {currentNotice.noticeTitle ? '수정' : '등록'}</h2>
                <div>
                    <input type="text" value={currentNotice.noticeTitle}
                           onChange={(e) =>
                               setCurrentNotice({ ...currentNotice, noticeTitle: e.target.value })}
                           placeholder="공지사항 제목" />
                    <textarea value={currentNotice.noticeContent}
                              onChange={(e) =>
                                  setCurrentNotice({ ...currentNotice, noticeContent: e.target.value })}
                              placeholder="공지사항 내용" />
                    <input type="file" onChange={(e) =>
                        setCurrentNotice({ ...currentNotice, noticeFile: e.target.files[0] })} />
                </div>
                <button onClick={handleSaveNotice}>저장</button>
            </TeacherModal>
        </div>
    );
}

export default TeacherNotice;