import axios from "axios";
import { useEffect } from "react";

const YouTubeVideoDuration = ({ youtubeUrl, onDurationFetched, apiKey }) => {
  console.log(apiKey);
  console.log(youtubeUrl);
  console.log(onDurationFetched);

  useEffect(() => {
    const fetchVideoDuration = async () => {
      if (!youtubeUrl) return;

      try {
        const videoId =
          youtubeUrl.split("v=")[1]?.split("&")[0] ||
          youtubeUrl.split("/").pop();

        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "contentDetails",
              id: videoId,
              key: apiKey,
            },
            mode: "cors",
          }
        );

        if (response.data.items.length > 0) {
          const isoDuration = response.data.items[0].contentDetails.duration;

          console.log("ISO Duration:", isoDuration);

          const totalSeconds = parseISODuration(isoDuration);

          // 동영상 초단위 부모 컴포넌트로 전달
          onDurationFetched(totalSeconds);
        }
      } catch (error) {
        console.error("Error fetching video duration", error);
      }
    };

    fetchVideoDuration();
  }, [youtubeUrl, apiKey, onDurationFetched]);

  const parseISODuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3], 10) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  };

  return null;
};

export default YouTubeVideoDuration;
