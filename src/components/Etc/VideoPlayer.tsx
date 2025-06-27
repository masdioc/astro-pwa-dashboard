import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        sources: [{ src, type: "application/x-mpegURL" }],
      });
    } else if (playerRef.current) {
      playerRef.current.src({ src, type: "application/x-mpegURL" });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin w-full aspect-video"
      />
    </div>
  );
};

export default VideoPlayer;
