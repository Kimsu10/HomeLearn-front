import React, { useState, useEffect } from "react";
import "./TeacherNotice.css";
import axios from "../../utils/axios";
import Pagination from "./Pagination";

const TeacherNotice = () => {
    const [boards, setBoards] = useState([]);
    const [expandedBoardId, setExpandedBoardId] = useState(null);
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [isBoardEditing, setIsBoardEditing] = useState(false);
    const [currentBoard, setCurrentBoard] = useState({
        boardId: '',
        boardType: '공지',
        boardTitle: '',
        boardDate: '',
        boardContent: '',
        boardFile: '',
        useDefaultFile: false, // 수정모달에서 파일 삭제 할 때 사용(기본값 false)
    });
    const [selectedBoards, setSelectedBoards] = useState([]); // 선택된 공지사항들 상태 관리
    const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태 관리

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        fetchNotices();
    }, [currentPage]);

    // 공지사항 목록
    const fetchNotices = async () => {
        try {
            const response = await axios.get("/teachers/notification-boards", {
                params: {
                    page: currentPage,
                    size: pageSize
                }
            });
            const { content, totalPages, number } = response.data;
            console.log("Total Pages:", totalPages, "Current Page:", number);

            setBoards(content);
            setTotalPages(totalPages);
            setCurrentPage(number);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    // 공지사항 상세 내용
    const handleToggleNotice = (boardId) => {
        setExpandedBoardId(expandedBoardId === boardId ? null : boardId);
    };

    // 공지사항 등록/수정 모달
    const handleOpenNoticeModal = (board = {
        boardId: '',
        boardType: '공지',
        boardTitle: '',
        boardDate: '',
        boardContent: '',
        boardFile: '',
        useDefaultFile: false,
    }) => {
        setCurrentBoard(board);
        setIsBoardEditing(!!board.boardId); // 공지사항 ID가 존재하면 수정
        setIsBoardModalOpen(true);
    };

    // 공지사항 등록/수정 모달 닫기
    const handleCloseNoticeModal = () => {
        setIsBoardModalOpen(false); // 모달 닫기
        setCurrentBoard({ // 현재 공지사항 상태 초기화
            boardId: '',
            boardType: '공지',
            boardTitle: '',
            boardDate: '',
            boardContent: '',
            boardFile: '',
            useDefaultFile: false,
        });
        setIsBoardEditing(false); // 수정 모드 해제
        setSelectedFile(null); // 선택된 파일 초기화
    };

    // 공지사항 입력 필드의 변경
    const handleNoticeChange = (e) => {
        const { name, value } = e.target;
        setCurrentBoard((prev) => ({ ...prev, [name]: value }));
    };

    // 파일 선택 시 처리
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file); // 선택된 파일 설정
        setCurrentBoard((prev) => ({
            ...prev,
            boardFile: file ? file.name : '',
            useDefaultFile: false
        })); // 현재 공지사항의 파일 정보 업데이트
    };

    // 선택된 파일을 삭제하는 함수
    const handleFileDelete = () => {
        setSelectedFile(null); // 선택된 파일 초기화
        setCurrentBoard((prev) => ({
            ...prev,
            boardFile: '',
            useDefaultFile: true // 파일 삭제 요청
        })); // 현재 공지사항의 파일 정보 초기화
    };

    // 공지사항 저장 함수 (등록 및 수정)
    const handleSaveNotice = async () => {
        try {
            const formData = new FormData();
            formData.append("title", currentBoard.boardTitle);
            formData.append("content", currentBoard.boardContent);
            formData.append("isEmergency", currentBoard.boardType === '긴급');
            // 파일 삭제 (true, false)
            formData.append("useDefaultFile", currentBoard.useDefaultFile || false);

            if (selectedFile) {
                formData.append("file", selectedFile);
            }
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            if (isBoardEditing) { // 수정
                const response = await axios.patch(`/teachers/notification-boards/${currentBoard.boardId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                console.log("수정된 공지사항",response.data);
            } else { // 등록
                await axios.post("/teachers/notification-boards", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            fetchNotices(); // 공지사항 목록 갱신
            handleCloseNoticeModal(); // 모달 닫기
            setCurrentPage(0);
        } catch (error) {
            console.error("Error saving notice:", error);
        }
    };

    // 선택된 공지사항을 삭제하는 함수
    const handleDeleteNotices = async () => {
        try {
            await axios({
                method: "DELETE",
                url: "/teachers/notification-boards",
                data: selectedBoards,
                headers: {
                    "Content-Type": 'application/json',
                },
            });
            console.log("삭제 요청 성공");
            setSelectedBoards([]);
            fetchNotices(); // 공지사항 목록 갱신
        } catch (error) {
            console.error("Error deleting notices:", error);
        }
    };

    // 체크박스 상태를 변경하는 함수
    const handleCheckboxChange = (boardId) => {
        setSelectedBoards((prev) =>
            prev.includes(boardId)
                ? prev.filter((id) => id !== boardId)
                : [...prev, boardId]
        );
    };

    return (
        <div className="notice-container">
            <div className="notice-header">
                <h1>공지사항</h1>
                <div className="notice-actions">
                    <button className="notice-action-button" onClick={() => handleOpenNoticeModal()}>
                        등록
                    </button>
                    <button className="notice-action-button" onClick={handleDeleteNotices}>
                        삭제
                    </button>
                </div>
            </div>
            {boards.map((board) => (
                <div key={board.boardId} className="notice-item">
                    <div className="notice-summary">
                        <input
                            type="checkbox"
                            checked={selectedBoards.includes(board.boardId)}
                            onChange={() => handleCheckboxChange(board.boardId)}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className={`notice-type ${board.isEmergency ? 'urgent' : 'normal'}`}>
                            {board.isEmergency ? '긴급' : '공지'}
                        </span>
                        <div className="notice-title-date">
                            <span className="notice-title">{board.title}</span>
                            <span className="notice-date">{board.createDate}</span>
                        </div>
                        <button className="notice-toggle-button" onClick={() => handleToggleNotice(board.boardId)}>
                            {expandedBoardId === board.boardId ? '-' : '+'}
                        </button>
                    </div>
                    {expandedBoardId === board.boardId && (
                        <div className="notice-content">
                            <button className="notice-edit-button" onClick={() => handleOpenNoticeModal({
                                boardId: board.boardId,
                                boardType: board.isEmergency ? '긴급' : '공지',
                                boardTitle: board.title,
                                boardDate: board.createDate,
                                boardContent: board.content,
                                boardFile: board.uploadFileName,
                            })}>
                                수정
                            </button>
                            <p>{board.content}</p>
                            {board.uploadFileName && (
                                <div className="notice-footer">
                                    <span>{board.uploadFileName}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <Pagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page - 1)}
            />

            {isBoardModalOpen && (
                <div className="notice-modal">
                    <div className="notice-modal-header">
                        <h2>{isBoardEditing ? '공지 사항 수정' : '공지 사항 등록'}</h2>
                        <button className="modal-close" onClick={handleCloseNoticeModal}>
                            &times;
                        </button>
                    </div>
                    <div className="notice-modal-body">
                        <div className="modal-header-row">
                            <div className="modal-title-label">제목</div>
                            <div className="modal-emergency-group">
                                <label className="emergency-checkbox">
                                    <input
                                        type="checkbox"
                                        name="boardType"
                                        checked={currentBoard.boardType === '긴급'}
                                        onChange={(e) =>
                                            setCurrentBoard((prev) => ({
                                                ...prev,
                                                boardType: e.target.checked ? '긴급' : '공지',
                                            }))
                                        }
                                    />
                                    긴급 여부
                                </label>
                            </div>
                        </div>
                        <input
                            type="text"
                            name="boardTitle"
                            value={currentBoard.boardTitle}
                            onChange={handleNoticeChange}
                            className="notice-title-input"
                        />
                        <label>내용</label>
                        <textarea
                            name="boardContent"
                            value={currentBoard.boardContent}
                            onChange={handleNoticeChange}
                        />
                        <label>파일 첨부</label>
                        <div className="notice-file-upload">
                            <input id="notice-file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                            <div className="file-input-container">
                                <input type="text" value={ selectedFile ? selectedFile.name : currentBoard.boardFile } readOnly />
                                {(selectedFile || currentBoard.boardFile) && (
                                    <button className="notice-file-delete-button" onClick={handleFileDelete}>
                                        삭제
                                    </button>
                                )}
                            </div>
                            <label htmlFor="notice-file-upload" className="notice-custom-file-upload">
                                <span>파일 첨부</span>
                            </label>
                        </div>
                    </div>
                    <div className="notice-modal-footer">
                        <button className="notice-submit-button" onClick={handleSaveNotice}>
                            {isBoardEditing ? '공지 사항 수정' : '공지 사항 등록'}
                        </button>
                        <button className="notice-cancel-button" onClick={handleCloseNoticeModal}>
                            등록취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherNotice;