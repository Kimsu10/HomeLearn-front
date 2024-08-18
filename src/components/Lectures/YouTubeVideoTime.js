import React, { useEffect } from "react";
import axios from "axios";

const YouTubeVideoDuration = ({ youtubeUrl, onDurationFetched }) => {
  useEffect(() => {
    const fetchVideoDuration = async () => {
      try {
        console.log("Fetching video duration for URL:", youtubeUrl);

        const videoId =
          youtubeUrl.split("v=")[1] || youtubeUrl.split("/").pop();
        console.log("Video ID:", videoId);

        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/videos",
          {
            params: {
              part: "contentDetails",
              id: videoId,
              key: process.env.REACT_APP_YOUTUBE_API_KEY,
            },
          }
        );

        console.log("API response:", response.data);

        if (response.data.items.length > 0) {
          const isoDuration = response.data.items[0].contentDetails.duration;
          console.log("ISO Duration:", isoDuration);

          const totalSeconds = parseISODuration(isoDuration);
          console.log("Total video duration in seconds:", totalSeconds);

          onDurationFetched(totalSeconds);
        }
      } catch (error) {
        console.error("Error fetching video duration", error);
      }
    };

    fetchVideoDuration();
  }, [youtubeUrl]);

  const parseISODuration = (isoDuration) => {
    console.log("Parsing ISO duration:", isoDuration);

    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      console.error("Failed to parse ISO duration:", isoDuration);
      return 0;
    }

    const hours = parseInt(match[1], 10) || 0;
    const minutes = parseInt(match[2], 10) || 0;
    const seconds = parseInt(match[3], 10) || 0;

    console.log("Hours:", hours, "Minutes:", minutes, "Seconds:", seconds);

    return hours * 3600 + minutes * 60 + seconds;
  };

  return null;
};

export default YouTubeVideoDuration;
