import React, { useState, useEffect } from "react";
import "./LectureVideo.css";
import useAxiosGet from "../../hooks/useAxiosGet";

const LectureVideo = ({ width, height }) => {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);

  const { data: lecture } = useAxiosGet(`/students/dash-boards/lectures`);

  const extractVideoId = (link) => {
    const match = link.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (lecture && lecture.youtubeUrl) {
      const extractedVideoId = extractVideoId(lecture.youtubeUrl);
      if (extractedVideoId) {
        setVideoId(extractedVideoId);
      } else {
        setError("잘못된 링크로 비디오를 찾을 수 없습니다.");
      }
    }
  }, [lecture]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!videoId) {
    return <p>비디오를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="lecture_container" style={{ position: "relative" }}>
      <iframe
        id="player"
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default LectureVideo;
