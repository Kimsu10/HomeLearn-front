import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./RecentVideo.css";

const RecentVideo = ({ url, lectureId, username, token, lastViewPoint }) => {
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerContainerRef = useRef(null);
  const progressInterval = useRef(null);
  const requestAnimationFrameRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const [completeTime, setCompleteTime] = useState("");

  useEffect(() => {
    if (url) {
      const videoId = extractVideoId(url);

      if (videoId) {
        loadYouTubeAPI(videoId);
      } else {
        setError(new Error("Invalid video URL"));
      }
      setLoading(false);
    } else {
      setError(new Error("No video URL provided"));
      setLoading(false);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      if (player) {
        stopProgressTracker();
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [url, player]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentProgress = player
        ? (player.getCurrentTime() / player.getDuration()) * 100
        : 0;
      setProgress(currentProgress);
      setLastPosition(currentProgress);

      let currentIsCompleted = false;
      let currentCompleteTime = "";

      if (currentProgress >= 97) {
        currentIsCompleted = true;
        currentCompleteTime = new Date().toISOString();
      }

      setIsCompleted(currentIsCompleted);
      setCompleteTime(currentCompleteTime);

      const watchData = {
        lastPosition: Math.round(currentProgress),
        lectureId,
        username,
        isCompleted: currentIsCompleted,
        completedDate: currentCompleteTime,
      };

      localStorage.setItem("watchData", JSON.stringify(watchData));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [duration, lectureId, username, player]);

  useEffect(() => {
    const updateProgress = () => {
      if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const totalDuration = player.getDuration();
        if (totalDuration > 0) {
          const currentProgress = (currentTime / totalDuration) * 100;
          setProgress(currentProgress);
          setCurrentTime(currentTime);
          setDuration(totalDuration);
        }
      }
      if (isPlaying) {
        requestAnimationFrameRef.current =
          requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      updateProgress();
    } else {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }

    return () => {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, [isPlaying, player]);

  const loadYouTubeAPI = (videoId) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player("youtube-player", {
        videoId: videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          autohide: 1,
          cc_load_policy: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setVolume(event.target.getVolume());
            setIsMuted(event.target.isMuted());
            const duration = event.target.getDuration();
            setDuration(duration);

            if (lastViewPoint > 0) {
              const lastViewTime = (lastViewPoint / 100) * duration;
              event.target.seekTo(lastViewTime, true);
              setProgress(lastViewPoint);
            }
          },
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
            if (event.data === window.YT.PlayerState.PLAYING) {
              startProgressTracker();
            } else {
              stopProgressTracker();
            }
          },
        },
      });
    };
  };

  const startProgressTracker = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (player && player.getCurrentTime) {
        const currentProgress =
          (player.getCurrentTime() / player.getDuration()) * 100;
        setProgress(currentProgress);
        setCurrentTime(player.getCurrentTime());
      }
    }, 1000);
  };

  const stopProgressTracker = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  };

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [player, isPlaying]);

  const toggleMute = () => {
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    player.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    player.seekTo(newTime, true);
    setProgress(newProgress);
    setCurrentTime(newTime);
  };

  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    player.setPlaybackRate(newRate);
    setPlaybackRate(newRate);
  };

  const extractVideoId = (link) => {
    const match = link.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  // const sendLastViewData = async () => {
  //   const watchData = JSON.parse(localStorage.getItem("watchData"));
  //   console.log(watchData);

  //   if (watchData) {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:8080/students/lectures/last-view",
  //         {
  //           method: "PATCH",
  //           headers: {
  //             "Content-Type": "application/json",
  //             access: token,
  //           },
  //           body: JSON.stringify(watchData),
  //         }
  //       );

  //       localStorage.removeItem("watchData");
  //       window.location.reload();

  //       if (!response.ok) {
  //         throw new Error("Failed to update the last view data");
  //       }
  //     } catch (error) {
  //       console.error("recentLecture error :", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   return () => {
  //     sendLastViewData();
  //   };
  // }, []);

  useEffect(() => {
    const sendLastViewData = async () => {
      const watchData = JSON.parse(localStorage.getItem("watchData"));
      console.log(watchData);

      if (watchData) {
        try {
          const response = await fetch(
            "http://localhost:8080/students/lectures/last-view",
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                access: token,
              },
              body: JSON.stringify(watchData),
            }
          );

          localStorage.removeItem("watchData");

          if (!response.ok) {
            throw new Error("Failed to update the last view data");
          }
        } catch (error) {
          console.error("recentLecture error :", error);
        }
      }
    };

    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      await sendLastViewData();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div
      ref={playerContainerRef}
      className={`recent-video-player-container ${
        isFullscreen ? "fullscreen" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {!loading && !error && (
        <>
          <div id="youtube-player" className="recent-youtube-player" />
          <div
            className={`recent-video-controls ${
              isHovering || isPlaying ? "" : "hidden"
            }`}
          >
            <button onClick={togglePlay} className="recent-play-button">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button onClick={toggleMute} className="recent-mute-button">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              className="recent-progress-bar"
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
            />
            <input
              className="recent-progress-bar-track"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
            />
            <span className="recent-video-time">
              {Math.floor(currentTime / 60)} : {Math.floor(currentTime % 60)}
              &nbsp; / {Math.floor(duration / 60)} : {Math.floor(duration % 60)}
            </span>
            <select
              value={playbackRate}
              onChange={handlePlaybackRateChange}
              className="recent-select-button"
            >
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>
            <button onClick={toggleFullscreen} className="recent-full-button">
              {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecentVideo;
