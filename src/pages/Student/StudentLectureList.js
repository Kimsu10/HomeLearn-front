import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentLectureList.css";
import LectureVideo from "../Teacher/play";
import StudentVideoModal from "../../components/Modal/StudentModal/StudentVideoModal";

const StudentLectureList = () => {
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState("all");
  const [subjectVideosData, setSubjectVideosData] = useState([]);
  const [subjectVideosError, setSubjectVideosError] = useState(null);
  const [subjectName, setSubjectName] = useState([]);
  const [subjectNamesError, setSubjectNamesError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState("전체");

  const fetchSubjectVideos = async (lectureId) => {
    try {
      const url =
        lectureId === "all"
          ? "/students/lectures?page=0"
          : `/students/lectures?page=0&subjectId=${lectureId}`;
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
    fetchSubjectNames();
  }, []);

  useEffect(() => {
    fetchSubjectVideos(selectedLectureId);
  }, [selectedLectureId]);

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

  const openModal = (youtubeUrl) => {
    setSelectedVideoUrl(youtubeUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideoUrl("");
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (lectureId, subjectName) => {
    setSelectedLectureId(lectureId);
    setSelectedSubjectName(subjectName);
    setIsDropdownOpen(false);
  };

  if (subjectNamesError || subjectVideosError) {
    return <div>데이터 로딩에 실패하였습니다.</div>;
  }

  return (
    <div className="subject_lecture_list_body">
      <div className="subject_lecture_list_main_container">
        <div className="subject_lecture_list_page_title_box">
          <h1 className="subject_lecture_list_page_title">강의 영상</h1>
          <div className="custom-select">
            <div className="select-selected" onClick={toggleDropdown}>
              {selectedSubjectName}
            </div>
            <div
              className={`select-items ${isDropdownOpen ? "" : "select-hide"}`}
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
        </div>
        <div className="subject_lecture_list_container">
          {subjectVideosData.map((el, idx) => (
            <div
              className="subject_lecture_list_content"
              key={idx}
              onClick={() => openModal(el.link)}
            >
              <img
                className="subject_lecture_list_image"
                alt="과목이미지"
                src={thumbnailUrls[idx]}
              />
              <h1 className="subject_lecture_list_title">{el.title}</h1>
              <p className="subject_lecture_list_description">{el.content}</p>
            </div>
          ))}
        </div>
      </div>
      <StudentVideoModal isOpen={isModalOpen} onClose={closeModal}>
        <LectureVideo url={selectedVideoUrl} />
      </StudentVideoModal>
    </div>
  );
};

export default StudentLectureList;
