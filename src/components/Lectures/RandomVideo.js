import React, { useEffect, useState } from "react";
import "./RandomVideo.css";

const RandomVideo = ({ width, height }) => {
  const youtubeKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  const query = process.env.REACT_APP_YOUTUBE_QUERY;
  const maxCount = 100;

  const [videoUrl, setVideoUrl] = useState("");
  console.log(videoUrl);
  const [videoArray, setVideoArray] = useState([]);

  const getRandomVideoId = (arr) => {
    const randomIdx = Math.floor(Math.random() * arr.length);
    return arr[randomIdx];
  };

  const showRandomVideo = () => {
    if (videoArray.length > 0) {
      const selectedVideo = getRandomVideoId(videoArray);
      const videoId = selectedVideo.id.videoId;
      const videoUrl = `https://www.youtube.com/embed/${videoId}`;
      setVideoUrl(videoUrl);
    } else {
      console.error("Video array is empty.");
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=${maxCount}&key=${youtubeKey}`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoArray(data.items);
          const firstVideo = getRandomVideoId(data.items);
          const firstVideoId = firstVideo.id.videoId;
          const firstVideoUrl = `https://www.youtube.com/embed/${firstVideoId}`;
          setVideoUrl(firstVideoUrl);
        } else {
          console.error("검색결과 없음.");
        }
      } catch (err) {
        console.error("YouTube API 가져오기 오류 또는 회수 초과:", err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="random_video_container">
      {videoUrl && (
        <div className="iframe_wrapper">
          <iframe
            id="player"
            width="100%"
            height={height}
            src={`${videoUrl}/?enablejsapi=1&modestbranding=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&fs=0&playsinline=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            className="random_video_iframe"
          ></iframe>
        </div>
      )}
      <img
        src="/images/refresh.png"
        alt="newVideoButton"
        className="get_random_video_btn"
        onClick={showRandomVideo}
      />
    </div>
  );
};

export default RandomVideo;
