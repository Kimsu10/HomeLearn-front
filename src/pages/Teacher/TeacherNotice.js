import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import "./TeacherNotice.css";

function TeacherNotice() {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        fetchNotices(currentPage);
    }, [currentPage]);

    const fetchNotices = async (page) => {
        try {
            const response = await axios.get("/teachers/notification-boards", {
                params: { page },
            });
            console.log('Fetched Notices:', response.data.content);
            setNotices(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    const handleAddOrUpdateNotice = async (notice) => {
        try {
            const formData = new FormData();
            formData.append("title", notice.title);
            formData.append("content", notice.content);
            formData.append("isEmergency", notice.isEmergency);
            if (notice.file) formData.append("file", notice.file);

            if (notice.id) {
                // Update existing notice
                await axios.patch(`/teachers/notification-boards/${notice.id}`, formData);
            } else {
                // Add new notice
                await axios.post("/teachers/notification-boards", formData);
            }

            fetchNotices(currentPage);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving notice:", error);
        }
    };

    const handleDeleteNotices = async () => {
        try {
            const selectedIds = notices.filter(notice => notice.isSelected).map(notice => notice.boardId);
            await axios.delete("/teachers/notification-boards", {
                data: selectedIds,
            });
            fetchNotices(currentPage);
        } catch (error) {
            console.error("Error deleting notices:", error);
        }
    };

    const handleOpenModal = (notice = null) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    return (
        <div className="teacher-notice-container">
            <div className="teacher-notice-header">
                <h1>강사 공지사항</h1>
                <div className="teacher-notice-actions">
                    <button className="notice-action-button" onClick={() => handleOpenModal()}>등록</button>
                    <button className="notice-action-button" onClick={handleDeleteNotices}>삭제</button>
                </div>
                <hr/>
                <div className="test-list">
                    <h3>테스트 리스트 1번</h3>
                    <p>8월 14일</p>
                    <hr/>
                </div>
                <div className="test-list">
                    <h3>테스트 리스트 2번</h3>
                    <p>8월 14일</p>
                    <hr/>
                </div>
            </div>

            <NoticeList notices={notices} onEdit={handleOpenModal}/>

            <div className="notice-footer">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {isModalOpen && (
                <NoticeModal notice={selectedNotice} onSave={handleAddOrUpdateNotice} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

function NoticeList({ notices, onEdit }) {
    return (
        <div className="notice-list">
            {notices.length > 0 ? (
                notices.map((notice) => (
                    <NoticeItem key={notice.boardId} notice={notice} onEdit={onEdit} />
                ))
            ) : (
                <p>공지사항이 없습니다.</p>
            )}
        </div>
    );
}

function NoticeItem({ notice, onEdit }) {
    return (
        <div className="notice-item">
            <span className="title">{notice.title}</span>
            <span className="date">{new Date(notice.createDate).toLocaleDateString()}</span>
            <button onClick={() => onEdit(notice)}>수정</button>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [...Array(totalPages).keys()];

    return (
        <div className="pagination">
            {pages.map((page) => (
                <button
                    key={page}
                    className={page === currentPage ? "active" : ""}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
        </div>
    );
}

function NoticeModal({ notice, onSave, onClose }) {
    const [title, setTitle] = useState(notice ? notice.title : "");
    const [content, setContent] = useState(notice ? notice.content : "");
    const [isEmergency, setIsEmergency] = useState(notice ? notice.isEmergency : false);
    const [file, setFile] = useState(null);

    const handleSubmit = () => {
        onSave({ ...notice, title, content, isEmergency, file });
    };

    return (
        <div className="modal">
            <h2>{notice ? "공지사항 수정" : "공지사항 등록"}</h2>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용"></textarea>
            <label>
                긴급 여부:
                <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} />
            </label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleSubmit}>저장</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
}

export default TeacherNotice;