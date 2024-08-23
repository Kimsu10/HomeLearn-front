import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import "./TeacherLectureList.css";
import LectureVideo from "./TeacherPlayer";
import StudentVideoModal from "../../components/Modal/StudentModal/StudentVideoModal";
import useGetFetch from "../../hooks/useGetFetch";
import { useLocation } from "react-router-dom";
import TeacherLectureEnroll from "./TeacherLectureEnroll";

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
  const [selectedLectureId, setSelectedLectureId] = useState("all");
  const [selectedSubjectName, setSelectedSubjectName] = useState("전체");
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const { data: subjectData, error: subjectError, loading: subjectLoading } = useGetFetch("/data/student/mainpage/sidebar.json", []);

  console.log(subjectVideosData);
  console.log(selectedVideoUrl);

  const fetchSubjectVideos = async (lectureId) => {
    console.log(lectureId);
    try {
      const url =
          lectureId === "all"
              ? "/teachers/lectures?page=0"
              : `/teachers/lectures?page=0&subjectId=${lectureId}`;
      const response = await axios.get(url);
      setSubjectVideosData(response.data.content || []);
    } catch (error) {
      setSubjectVideosError(error);
      console.error("Error fetching subject videos:", error);
    }
  };

  const fetchSubjectNames = async () => {
    try {
      const response = await axios.get("/teachers/lectures/subject-select");
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
    fetchSubjectVideos(selectedLectureId);
  }, [selectedLectureId]);

console.log(subjectVideosData);

  useEffect(() => {
    fetchSubjectNames();
  }, []);

  useEffect(() => {
    if (subjectVideosData.length > 0) {
      const urls = subjectVideosData.map((el) =>
          getYouTubeThumbnailUrl(el.link)
      );
      setThumbnailUrls(urls);
    }
  }, [subjectVideosData]);

  const getYouTubeThumbnailUrl = (youtubeUrl) => {
    const videoId =
        youtubeUrl.split("v=")[1] || youtubeUrl.split("youtu.be/")[1];
    if (videoId) {
      const ampersandPosition = videoId.indexOf("&");
      if (ampersandPosition !== -1) {
        return `https://img.youtube.com/vi/${videoId.substring(
            0,
            ampersandPosition
        )}/mqdefault.jpg`;
      }
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return null;
  };


  const openModal = useCallback((youtubeUrl) => {
    setSelectedVideoUrl(youtubeUrl);
    setIsModalOpen(true); // 부모 컴포넌트의 상태 업데이트
  }, [setIsModalOpen]);

  const closeModal = useCallback(() => {
    setSelectedVideoUrl("");
    setIsModalOpen(false); // 부모 컴포넌트의 상태 업데이트
    window.location.reload();
  }, [setIsModalOpen]);


  const openEnrollModal = () => {
    setIsEnrollModalOpen(true);
  };

  const closeEnrollModal = () => {
    setIsEnrollModalOpen(false);
  };


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (lectureId, subjectName) => {
    setSelectedLectureId(lectureId);
    setSelectedSubjectName(subjectName);
    setIsDropdownOpen(false);
  };

  

  if (subjectLoading) {
    return <div className="loading">데이터를 불러오는 중입니다...</div>;
  }

  
console.log(subjectName);
  return (
      <div className="teacher_lecture_list_body">
        <div className="teacher_lecture_list_main_container">
          <div className="teacher_lecture_list_page_title_box">
            <h1 className="teacher_lecture_list_page_title">강의 영상</h1>
            <div className="teacher-custom-select-container">
              <div className="teacher-custom-selected">
                <div className="teacher-select-selected" onClick={toggleDropdown}>
                  {selectedSubjectName}
                </div>
                <div
                    className={`teacher-select-items ${isDropdownOpen ? "" : "select-hide"}`}
                >
                  <div
                      data-value="all"
                      onClick={() => handleOptionClick("all", "전체")}
                  >
                    전체
                  </div>
                  {subjectName.map((el) => (
                      <div
                          data-value={el.subjectId}
                          key={el.subjectId}
                          onClick={() => handleOptionClick(el.subjectId, el.name)}
                      >
                        {el.name}
                      </div>
                  ))}

                </div>
              </div>
              <button
                  className="teacher_lecture_register"
                  onClick={openEnrollModal}
              >등록
              </button>

            </div>
          </div>
          <div className="teacher_lecture_list_container">
            {subjectVideosData.map((el, idx) => (
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

        <TeacherLectureEnroll
            isOpen={isEnrollModalOpen}
            onClose={closeEnrollModal}
        />
      </div>
  );
};

export default TeacherLectureList;