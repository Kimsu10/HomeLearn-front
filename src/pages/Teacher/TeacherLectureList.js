import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./TeacherLectureList.css";
import LectureVideo from "./TeacherPlayer";
import StudentVideoModal from "../../components/Modal/StudentModal/StudentVideoModal";
import useGetFetch from "../../hooks/useGetFetch";
import { useLocation } from "react-router-dom";

const TeacherLectureList = () => {
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [subjectVideosData, setSubjectVideosData] = useState([]);
  const [subjectVideosError, setSubjectVideosError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("전체");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const location = useLocation();
  const [subjectName, setSubjectName] = useState([]);
  const [subjectNamesError, setSubjectNamesError] = useState(null);

  const { data: subjectData, error: subjectError, loading: subjectLoading } = useGetFetch("/data/student/mainpage/sidebar.json", []);

  const fetchSubjectVideos = async (lectureId) => {
    console.log(lectureId);
    try {
      const url =
          lectureId === "all"
              ? "/students/lectures?page=0"
              : `/students/lectures?page=0&subjectId=1`;
      const response = await axios.get(url);
      setSubjectVideosData(response.data.content || []);
    } catch (error) {
      setSubjectVideosError(error);
      console.error("Error fetching subject videos:", error);
    }
  };

  const fetchSubjectNames = async () => {
    try {
      const response = await axios.get("/students/lectures/subject-select");
      setSubjectName(response.data);
    } catch (error) {
      setSubjectNamesError(error);
      console.error("Error fetching subject names:", error);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/teachers/subject')) {
      setDropdownOpen('subject');
    } else if (path.startsWith('/teachers/notice')) {
      setDropdownOpen('notice');
    } else if (path.startsWith('/teachers/contact')) {
      setDropdownOpen('contact');
    } else {
      setDropdownOpen(null);
    }
  }, [location]);

  const isActive = (path) => {
    if (path === '/teachers') {
      return location.pathname === '/teachers' || location.pathname === '/teachers/';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    fetchSubjectVideos();
  }, [fetchSubjectVideos]);

  useEffect(() => {
    if (subjectVideosData.length > 0) {
      const urls = subjectVideosData.map((el) => getYouTubeThumbnailUrl(el.link));
      setThumbnailUrls(urls);
    }
  }, [subjectVideosData]);

  const getYouTubeThumbnailUrl = useCallback((youtubeUrl) => {
    // 기존 코드 유지
  }, []);

  const openModal = useCallback((youtubeUrl) => {
    setSelectedVideoUrl(youtubeUrl);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVideoUrl("");
  }, []);

  const toggleDropdown = useCallback((menu) => {
    setDropdownOpen(prevState => prevState === menu ? null : menu);
  }, []);

  const handleSubjectSelect = useCallback((subjectName) => {
    setSelectedSubject(subjectName);
    setIsDropdownOpen(false);
  }, []);

  const filteredVideos = useMemo(() => {
    return subjectVideosData.filter(video =>
        selectedSubject === "전체" || video.subject === selectedSubject
    );
  }, [subjectVideosData, selectedSubject]);

  if (subjectLoading) {
    return <div className="loading">데이터를 불러오는 중입니다...</div>;
  }

  if (subjectVideosError || subjectError) {
    return (
        <div className="error">
          <p>데이터 로딩에 실패하였습니다.</p>
          <button onClick={fetchSubjectVideos}>다시 시도</button>
        </div>
    );
  }

  return (
      <div className="subject_lecture_list_body">
        <div className="subject_lecture_list_main_container">
          <div className="subject_lecture_list_page_title_box">
            <h1 className="subject_lecture_list_page_title">강의 영상</h1>
            <div className="custom-select">
              <div className={`teacher_lecture_dropdown ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                <div
                    className={`teacher_lecture_dropdownHeader ${isActive('/teachers/subject') ? 'active' : ''}`}
                    onClick={() => toggleDropdown('subject')}>
                  과목
                  <span className={`teacher_lecture_dropdownArrow ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                  <i className="fa-solid fa-caret-down"></i>
                </span>
                </div>
                <ul className={`teacher_lecture_subMenu ${dropdownOpen === 'subject' ? 'open' : ''}`}>
                  {subjectData?.subject?.map((el) => (
                      <li key={el.id}>
                        <div
                            className={isActive(`/teachers/${el.name}/board`) ? 'teacher_sideBar_link active' : 'teacher_sideBar_link'}
                            onClick={() => handleSubjectSelect(el.name)}
                        >
                          {el.name}
                        </div>
                      </li>
                  ))}
                </ul>
              </div>
              <button className="teacher_lecture_register">등록</button>
            </div>
          </div>
          <div className="teacher_lecture_list_container">
            {filteredVideos.map((el, idx) => (
                <div
                    className="teacher_lecture_list_content"
                    key={idx}
                    onClick={() => openModal(el.link)}
                >
                  <img
                      className="teacher_lecture_list_image"
                      alt="과목이미지"
                      src={thumbnailUrls[idx]}
                  />
                  <h1 className="teacher_lecture_list_title">{el.title}</h1>
                  <p className="teacher_lecture_list_description">{el.content}</p>
                </div>
            ))}
          </div>
        </div>
        <StudentVideoModal isOpen={isModalOpen} onClose={closeModal}>
          <LectureVideo
              url={selectedVideoUrl}
              subjectVideos={subjectVideosData}
          />
        </StudentVideoModal>
      </div>
  );
};

export default TeacherLectureList;