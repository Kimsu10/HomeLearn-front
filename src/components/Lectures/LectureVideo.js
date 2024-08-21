import React, { useState, useEffect, useRef } from "react";
import "./LectureVideo.css";
import useAxiosGet from "../../hooks/useAxiosGet";

const LectureVideo = ({ width, height }) => {
  const [videoId, setVideoId] = useState(null);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

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

  useEffect(() => {
    if (videoId) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        const player = new window.YT.Player(iframeRef.current, {
          videoId: videoId,
          events: {
            onReady: () => {},
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (iframeRef.current.requestFullscreen) {
                  iframeRef.current.requestFullscreen();
                } else if (iframeRef.current.webkitRequestFullscreen) {
                  iframeRef.current.webkitRequestFullscreen();
                } else if (iframeRef.current.mozRequestFullScreen) {
                  iframeRef.current.mozRequestFullScreen();
                } else if (iframeRef.current.msRequestFullscreen) {
                  iframeRef.current.msRequestFullscreen();
                }
              }
            },
          },
        });
      };
    }
  }, [videoId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!videoId) {
    return <p>오늘 시청할 강의가 없습니다.</p>;
  }

  return (
    <div className="lecture_container" style={{ position: "relative" }}>
      <iframe
        ref={iframeRef}
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
