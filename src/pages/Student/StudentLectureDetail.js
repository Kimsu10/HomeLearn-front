import { useNavigate } from "react-router-dom";
import useGetFetch from "../../hooks/useGetFetch";
import "./StudentLectureDetail.css";
import LectureVideo from "./StudentPlayer";
import { useEffect } from "react";

const StudentLectureDetail = ({ baseUrl }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: lectureVideo,
    loading: lectureVideoLoading,
    error: lectureVideoError,
  } = useGetFetch("/data/student/mainLecture/mainLectureDetail.json", "");

  return (
    <div className="subject_lecture_detail_main_container">
      <div className="subject_lecture_detail_video_container">
        <LectureVideo />
        <div className="subject_lecutre_video_title_box">
          <h1 className="subject_lecutre_video_title">{lectureVideo.title}</h1>
          <span className="subject_lecutre_video__type_name">
            {lectureVideo.subjectName}
          </span>
        </div>
        <div className="subject_lecutre_video_description_box">
          <p className="subject_lecutre_video_description">
            {lectureVideo.content}
          </p>
        </div>
        {/* 강의 영상 리스트 */}
        <div className="lecture_videos_lists_box">
          아예 그냥 컴포넌트를 분리해서 갖다 박아버리는 방향으로 갈까..
        </div>
      </div>
    </div>
  );
};
export default StudentLectureDetail;
