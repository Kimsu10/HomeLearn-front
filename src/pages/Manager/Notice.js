import React, { useState } from 'react';
import './Notice.css';

const initialNotices = [
  { noticeId: 1, noticeType: '긴급', noticeTitle: '사이트 점검 안내', noticeDate: '2024-07-23', noticeContent: '대성진', noticeFile: '' },
  { noticeId: 2, noticeType: '긴급', noticeTitle: '사이트 점검 안내', noticeDate: '2024-07-23', noticeContent: '신수정', noticeFile: '' },
  { noticeId: 3, noticeType: '공지', noticeTitle: '사이트 점검 안내', noticeDate: '2024-07-23', noticeContent: '너무 졸리다', noticeFile: '' },
];

const Notice = () => {
  const [notices, setNotices] = useState(initialNotices);
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isNoticeEditing, setIsNoticeEditing] = useState(false);
  const [currentNotice, setCurrentNotice] = useState({ noticeType: '공지', noticeTitle: '', noticeDate: '', noticeContent: '', noticeFile: '' });
  const [selectedNotices, setSelectedNotices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleToggleNotice = (noticeId) => {
    setExpandedNoticeId(expandedNoticeId === noticeId ? null : noticeId);
  };

  const handleOpenNoticeModal = (notice = { noticeType: '공지', noticeTitle: '', noticeDate: '', noticeContent: '', noticeFile: '' }) => {
    setCurrentNotice(notice);
    setIsNoticeEditing(!!notice.noticeId);
    setIsNoticeModalOpen(true);
  };

  const handleCloseNoticeModal = () => {
    setIsNoticeModalOpen(false);
    setCurrentNotice({ noticeType: '공지', noticeTitle: '', noticeDate: '', noticeContent: '', noticeFile: '' });
    setIsNoticeEditing(false);
    setSelectedFile(null);
  };

  const handleNoticeChange = (e) => {
    const { name, value } = e.target;
    setCurrentNotice((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setCurrentNotice((prev) => ({ ...prev, noticeFile: file ? file.name : '' }));
  };

  const handleFileDelete = () => {
    setSelectedFile(null);
    setCurrentNotice((prev) => ({ ...prev, noticeFile: '' }));
  };

  const handleSaveNotice = () => {
    if (isNoticeEditing) {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.noticeId === currentNotice.noticeId ? currentNotice : notice
        )
      );
    } else {
      setNotices((prev) => [
        ...prev,
        { ...currentNotice, noticeId: prev.length + 1, noticeDate: new Date().toISOString().split('T')[0] },
      ]);
    }
    handleCloseNoticeModal();
  };

  const handleDeleteNotices = () => {
    if (selectedNotices.length > 0) {
      setNotices((prev) => prev.filter((notice) => !selectedNotices.includes(notice.noticeId)));
      setSelectedNotices([]);
    } else if (currentNotice.noticeId) {
      setNotices((prev) => prev.filter((notice) => notice.noticeId !== currentNotice.noticeId));
    }
    handleCloseNoticeModal();
  };

  const handleCheckboxChange = (noticeId) => {
    setSelectedNotices((prev) =>
      prev.includes(noticeId) ? prev.filter((id) => id !== noticeId) : [...prev, noticeId]
    );
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h1>공지사항</h1>
        <div className="notice-actions">
          <button className="notice-action-button" onClick={() => handleOpenNoticeModal()}>등록</button>
          <button className="notice-action-button" onClick={handleDeleteNotices}>삭제</button>
        </div>
      </div>
      {notices.map((notice) => (
        <div key={notice.noticeId} className="notice-item">
          <div className="notice-summary">
            <input
              type="checkbox"
              checked={selectedNotices.includes(notice.noticeId)}
              onChange={() => handleCheckboxChange(notice.noticeId)}
            />
            <span className={`notice-type ${notice.noticeType === '긴급' ? 'urgent' : 'normal'}`}>{notice.noticeType}</span>
            <div className="notice-title-date">
              <span className="notice-title">{notice.noticeTitle}</span>
              <span className="notice-date">{notice.noticeDate}</span>
            </div>
            <button className="notice-toggle-button" onClick={() => handleToggleNotice(notice.noticeId)}>
              {expandedNoticeId === notice.noticeId ? '-' : '+'}
            </button>
          </div>
          {expandedNoticeId === notice.noticeId && (
            <div className="notice-content">
              <button className="notice-edit-button" onClick={() => handleOpenNoticeModal(notice)}>수정</button>
              <p>{notice.noticeContent}</p>
              {notice.noticeFile && <div className="notice-footer">
                <span>{notice.noticeFile}</span>
              </div>}
            </div>
          )}
        </div>
      ))}

      {isNoticeModalOpen && (
        <div className="notice-modal">
          <div className="notice-modal-header">
            <h2>{isNoticeEditing ? '공지 사항 수정' : '공지 사항 등록'}</h2>
            <button className="modal-close" onClick={handleCloseNoticeModal}>&times;</button>
          </div>
          <div className="notice-modal-body">
            <div className="modal-header-row">
              <div className="modal-title-label">제목</div>
              <div className="modal-emergency-group">
                <label className="emergency-checkbox">
                  <input
                    type="checkbox"
                    name="noticeType"
                    checked={currentNotice.noticeType === '긴급'}
                    onChange={(e) => setCurrentNotice((prev) => ({ ...prev, noticeType: e.target.checked ? '긴급' : '공지' }))}
                  />
                  긴급 여부
                </label>
              </div>
            </div>
            <input
              type="text"
              name="noticeTitle"
              value={currentNotice.noticeTitle}
              onChange={handleNoticeChange}
              className="notice-title-input"
            />
            <label>내용</label>
            <textarea
              name="noticeContent"
              value={currentNotice.noticeContent}
              onChange={handleNoticeChange}
            />
            <label>파일 첨부</label>
            <div className="notice-file-upload">
              <input id="notice-file-upload" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              <div className="file-input-container">
                <input type="text" value={currentNotice.noticeFile} readOnly />
                {currentNotice.noticeFile && (
                  <button
                    className="notice-file-delete-button"
                    onClick={handleFileDelete}
                  >
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
              {isNoticeEditing ? '공지 사항 수정' : '공지 사항 등록'}
            </button>
            <button className="notice-cancel-button" onClick={handleCloseNoticeModal}>등록취소</button>
            {isNoticeEditing && (
              <button className="notice-delete-button" onClick={handleDeleteNotices}>공지 사항 삭제</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notice;
