import React, { useState } from 'react';


const showNotices = [
    { boardId: null, isEmergency: 'true', title: '긴급제목1', content: '공지사항 테스트 입니다', createDate: '', filePath: '', uploadFileName: '' },
    { boardId: null, isEmergency: 'true', title: '긴급제목2', content: '공지사항 테스트 입니다', createDate: '', filePath: '', uploadFileName: '' },
    { boardId: null, isEmergency: 'false', title: '일반제목1', content: '공지사항 테스트 입니다', createDate: '', filePath: '', uploadFileName: '' },
    { boardId: null, isEmergency: 'false', title: '일반제목1', content: '공지사항 테스트 입니다', createDate: '', filePath: '', uploadFileName: '' },
    { boardId: null, isEmergency: 'false', title: '일반제목1', content: '공지사항 테스트 입니다', createDate: '', filePath: '', uploadFileName: '' },
];


const TecherNotification = () => {
    const [teacherNotices, setTeacherNotices] = useState(showNotices);
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState();
    const [isNoticeEditing, setIsNoticeEditing] = useState();
    const [currentNotice, setCurrentNotice] = useState();
    const [selectedNotice, setSelectedNotice] = useState();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleToggleNotice = (boardId) => {

    }
}

export default TecherNotification;