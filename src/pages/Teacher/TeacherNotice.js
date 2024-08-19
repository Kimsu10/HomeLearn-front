import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import useAxiosGet from "../../hooks/useAxiosGet";
import useAxiosPost from "../../hooks/useAxiosPost";
import useAxiosDelete from "../../hooks/useAxiosDelete";
import Pagination from "./Pagination";
import "./TeacherNotice.css";

function TeacherNotice() {
    //const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    const { data: notices, loading: loadingNotices, error: errorNotices } = useAxiosGet(
        "/teachers/notification-boards",
        { page: currentPage, size: pageSize }
    );
    const { postRequest: saveNotice, loading: loadingSaveNotice, error: errorSaveNotice } = useAxiosPost(
        "/teachers/notification-boards",
    );
    const { deleteRequest: deleteNotices, loading: loadingDeleteNotices, error: errorDeleteNotices } = useAxiosDelete(
        "/teachers/notification-boards",
    );

    // 모달
    const [checkSelect, setCheckSelect] = useState([]);
    const [expandedNoticeId, setExpandedNoticeId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditing, setIsModalEditing] = useState(false);
    const [currentNotice, setCurrentNotice] = useState({
        noticeTitle: '',
        noticeContent: '',
        noticeType: '공지',
        noticeFile: '',
    });

    const handleOpenNoticeModal = (notice = null) => {
        setIsModalOpen(true);
        if (notice) {
            setCurrentNotice(notice);
            setIsModalEditing(true);
        } else {
            setCurrentNotice({
                noticeTitle: '',
                noticeContent: '',
                noticeType: '공지',
                noticeFile: '',
            });
            setIsModalEditing(false);
        }
    };

    const handleSaveNotice = async () => {
        try {
            // FormData 객체 생성
            const formData = new FormData();
            formData.append("title", currentNotice.noticeTitle);
            formData.append("content", currentNotice.noticeContent);
            formData.append("isEmergency", currentNotice.noticeType === '긴급');
            if(currentNotice.noticeFile) {
                formData.append("file", currentNotice.noticeFile);
            }
            await saveNotice(formData);
            setCurrentPage(0);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error Saving Teacher notice", error);
        }
    };

    const handleDeleteNotices = async () => {
        try {
            await deleteNotices({ boardIds: checkSelect });
            setCurrentPage(0);
            setCheckSelect([]);
        } catch (error) {
            console.error("Error Deleting Teacher notices", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentNotice((prev) => ({
                ...prev,
                noticeFile: file,
            }));
        }
    };

    const handleFileDelete = () => {
        setCurrentNotice((prev) => ({
            ...prev,
            noticeFile: '',
        }));
    };

    const handleNoticeChange = (e) => {
        const { name, value } = e.target;
        setCurrentNotice((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    if (loadingNotices || loadingSaveNotice || loadingDeleteNotices) return <div>Loading...</div>;
    if (errorNotices || errorSaveNotice || errorDeleteNotices) return <div>Error occurred</div>;

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h1>공지사항</h1>
                <div className="notice-actions">
                    <button className="notice-action-button" onClick={() => handleOpenNoticeModal()}>등록</button>
                    <button className="notice-action-button" onClick={handleDeleteNotices}>삭제</button>
                </div>
            </div>

            { notices && notices.content.map((notice) => (
                <div key={notice.boardId} className="notice-item">
                    <div className="notice-summary">
                        <input
                            type="checkbox"
                            checked={checkSelect.includes(notice.boardId)}
                            onChange={() => setCheckSelect((prev) =>
                                prev.includes(notice.boardId)
                                    ? prev.filter((id) => id !== notice.boardId)
                                    : [...prev, notice.boardId]
                            )}
                        />
                        <span
                            className={`notice-type ${notice.noticeType === '긴급' ? 'urgent' : 'normal'}`}>{notice.noticeType}</span>
                        <button onClick={() => handleOpenNoticeModal(notice)}>수정</button>
                    </div>
                </div>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default TeacherNotice;