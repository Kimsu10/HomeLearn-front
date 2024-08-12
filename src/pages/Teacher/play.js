import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronRight,
  ChevronLeft,
  Info,
  Code,
} from "lucide-react";
import "./play.css";
import { useNavigate } from "react-router-dom";
import useGetFetch from "../../hooks/useGetFetch";
import axios from "axios";

const LectureVideo = ({ url }) => {
  console.log(url);
  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [links, setLinks] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("info");
  const [videoTitle, setVideoTitle] = useState("");
  const playerContainerRef = useRef(null);
  const progressInterval = useRef(null);
  const requestAnimationFrameRef = useRef(null);

  // 컴파일러 관련 상태 추가
  const [code, setCode] = useState(
    'public class Main {\n    public static void main(String[] args) {\n        System.out.println("hello, world");\n    }\n}'
  );
  const [language, setLanguage] = useState("java");
  const [compilerOutput, setCompilerOutput] =
    useState("출력이 여기에 표시됩니다.");

  const languageTemplates = {
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    python: `print("Hello, World!")`,
    javascript: `console.log("Hello, World!");`,
  };

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const navigate = useNavigate();

  const { data: subjectVideos, error: subjectVideosError } = useGetFetch(
    "/data/student/mainLecture/lectureList.json",
    []
  );

  const { data: subjectName, error: subjectNameError } = useGetFetch(
    "/data/student/mainpage/subjectCategory.json",
    []
  );

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // 값은 잘 들어오는데 영상이 바로 뜨지 않음 ->
  console.log(url);

  useEffect(() => {
    if (url) {
      const videoId = extractVideoId(url);
      console.log(videoId);
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
    const updateProgress = () => {
      if (player && player.getCurrentTime && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const totalDuration = player.getDuration();
        if (totalDuration > 0) {
          const currentProgress = (currentTime / totalDuration) * 100;
          setProgress(currentProgress);
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
            setDuration(event.target.getDuration());
            setVideoTitle(event.target.getVideoData().title);
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

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    player.seekTo(newTime, true);
    setProgress(newProgress);
  };

  const handlePlaybackRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    player.setPlaybackRate(newRate);
    setPlaybackRate(newRate);
  };

  const extractVideoId = (link) => {
    console.log(link);
    const match = link.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    if (!isSidebarOpen) {
      setSidebarContent("info");
    }
  };

  const changeSidebarContent = (content) => {
    setSidebarContent(content);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const runCode = async () => {
    setCompilerOutput("코드 실행 중...");
    const languageId = {
      python: 71,
      javascript: 63,
      java: 62,
    }[language];

    try {
      // Base64로 인코딩
      const encodedCode = btoa(unescape(encodeURIComponent(code)));
      console.log("Sending encoded code to API:", encodedCode);

      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: languageId,
          source_code: code,
          stdin: "",
          base64_encoded: true,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":
              "180f0cf557msh68f08910ce677b9p1712c4jsn889cb7401d81",
          },
        }
      );

      console.log("API response:", response.data);
      const { token } = response.data;

      // 결과를 기다리기 위해 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key":
              "180f0cf557msh68f08910ce677b9p1712c4jsn889cb7401d81",
          },
          params: {
            base64_encoded: "true", // 결과도 Base64로 인코딩되어 있음을 명시
          },
        }
      );

      const decodedOutput = result.data.stdout
        ? decodeURIComponent(escape(atob(result.data.stdout)))
        : result.data.stderr
        ? decodeURIComponent(escape(atob(result.data.stderr)))
        : "출력 없음";
      setCompilerOutput(decodedOutput);
    } catch (error) {
      console.error("Error running code:", error);
      setCompilerOutput("코드 실행 중 오류 발생: " + error.message);
    }
  };

  const renderSidebarContent = () => {
    console.log(subjectVideos);
    switch (sidebarContent) {
      case "info":
        return (
          <div className="player_sidebar-content">
            <p className="player_category">동영상 정보</p>
            <div className="player_line"></div>
            <p className="player_title">{videoTitle}</p>
            <p className="player_category">다른 강의</p>
            <div className="player_line"></div>
            <div className="player_lecture_list_container">
              {subjectVideos.content.slice(0, 2).map((el, idx) => (
                <div className="player_lecture_list_content" key={idx}>
                  <img
                    className="player_lecture_list_image"
                    alt="과목이미지"
                    src={el.link}
                  />
                  <h1
                    className="player_lecture_list_title"
                    onClick={() =>
                      navigate(
                        `/students/${el.subjectName}/lectures/${el.lectureId}`
                      )
                    }
                  >
                    {el.title}
                  </h1>
                  <p className="player_lecture_list_description">
                    {el.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "compiler":
        return (
          <div className="player-sidebar-content compiler-container">
            <p className="compiler-title">컴파일러</p>
            <div className="player_line"></div>
            <div className="compiler-header">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="compiler-language-select"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
              <button onClick={runCode} className="compiler-run-button">
                <Play size={16} className="compiler-run-icon" />
                Run
              </button>
            </div>
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="compiler-code-editor"
              placeholder="여기에 코드를 입력하세요"
            />
            <div className="compiler-output-container">
              <pre className="compiler-output-content">{compilerOutput}</pre>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (subjectNameError || subjectVideosError) {
    return <div>데이터 로딩에 실패하였습니다.</div>;
  }

  if (loading) {
    return <p>비디오 로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error.message}</p>;
  }

  if (!links) {
    return <p>잘못된 링크로 비디오를 찾을 수 없습니다.</p>;
  }

  return (
    <div
      className={`custom-youtube-player-container ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <div
        ref={playerContainerRef}
        className={`custom-youtube-player ${isFullscreen ? "fullscreen" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div id="youtube-player"></div>

        <div
          className={`controls ${isHovering || !isPlaying ? "visible" : ""}`}
        >
          <div className="controls-top">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="progress-slider"
              style={{ "--value": `${progress}%` }}
            />
          </div>
          <div className="controls-bottom">
            <div className="controls-bottom-left">
              <button onClick={togglePlay} className="control-btn">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={toggleMute} className="control-btn">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{ "--value": `${volume}%` }}
              />
            </div>
            <div className="controls-bottom-right">
              <select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className="playback-rate-select"
              >
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">Normal</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
              <button onClick={toggleFullscreen} className="control-btn">
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`player-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="player-sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? (
            <ChevronRight size={24} />
          ) : (
            <ChevronLeft size={24} />
          )}
        </button>
        <div className="player_sidebar-buttons">
          <div className="player_sidebar_button_list">
            <button
              className="player_sidebar-btn"
              onClick={() => changeSidebarContent("info")}
            >
              <Info size={24} />
              <span>동영상 정보</span>
            </button>
          </div>
          <div className="player_sidebar_button_list">
            <button
              className="player_sidebar-btn"
              onClick={() => changeSidebarContent("compiler")}
            >
              <Code size={24} />
              <span>컴파일러</span>
            </button>
          </div>
        </div>
        {renderSidebarContent()}
      </div>
    </div>
  );
};

export default LectureVideo;
