import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";

// Load VideoJS dynamically to avoid SSR issues
// const VideoPlayer = dynamic(() => import("./VideoPlayer"), { ssr: false });

interface Channel {
  name: string;
  src: string;
}

const channels: Channel[] = [
  {
    name: "Metro TV",
    src: "https://iptv-org.github.io/iptv/index.m3u",
  },
  {
    name: "TVRI Nasional",
    src: "https://cdn-telkomsel-01.akamaized.net/Content/HLS/Live/channel(tvri)/index.m3u8",
  },
  {
    name: "TV One",
    src: "https://bamus-media.cdn.turner.com/Content/HLS/Live/Channel(tvone)/index.m3u8",
  },
  {
    name: "Kompas TV",
    src: "https://kompastv.akamaized.net/Content/HLS/Live/channel(compas)/index.m3u8",
  },
  {
    name: "ANTV",
    src: "https://cdn-an.tv/Content/HLS/Live/channel(antv)/index.m3u8",
  },
  // Tambahkan lebih banyak jika tersedia
];

const TvOnlinePlayer: React.FC = () => {
  const [current, setCurrent] = useState<Channel>(channels[0]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        TV Online Indonesia
      </h1>

      <div className="mb-4 max-w-4xl mx-auto">
        <VideoPlayer src={current.src} />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {channels.map((ch) => (
          <button
            key={ch.name}
            onClick={() => setCurrent(ch)}
            className={`px-4 py-2 rounded text-white transition font-semibold ${
              ch.name === current.name
                ? "bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {ch.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TvOnlinePlayer;
