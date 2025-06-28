import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

function getUserId(): number | null {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.id ?? null;
  } catch {
    return null;
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function TrackedVideoPlayer({
  url,
  materialId,
}: {
  url: string;
  materialId: number;
}) {
  //   const playerRef = useRef<React.RefObject<typeof ReactPlayer>>(null); // boleh, tapi agak ribet
  const playerRef = useRef<any>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [rate, setRate] = useState(1);
  const [durationPlayed, setDurationPlayed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const logToServer = async (action: string) => {
    const user_id = getUserId();
    const tanggal = getTodayDate();
    if (!user_id) return;

    await fetch("/api/log_belajar/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        material_id: materialId,
        action,
        tanggal,
        durasi: durationPlayed,
        waktu: new Date().toISOString(),
      }),
    });
  };

  const onPlay = () => {
    setPlaying(true);
    logToServer("play");
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setDurationPlayed((d) => d + 1);
      }, 1000);
    }
  };

  const onPause = () => {
    setPlaying(false);
    logToServer("pause");
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };

  const onEnd = () => {
    setPlaying(false);
    logToServer("ended");
    clearInterval(intervalRef.current!);
    intervalRef.current = null;

    // Tandai materi selesai
    const user_id = getUserId();
    const tanggal = getTodayDate();
    if (!user_id) return;
    fetch("/api/log_belajar/selesai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        material_id: materialId,
        tanggal,
        status: "selesai",
        durasi: durationPlayed,
      }),
    });
  };

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="aspect-video rounded overflow-hidden mb-4">
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          controls={false}
          width="100%"
          height="100%"
          volume={volume}
          playbackRate={rate}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnd}
        />
      </div>

      <div className="flex gap-3 flex-wrap justify-center items-center">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white"
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "⏸ Pause" : "▶️ Play"}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
        <span>🔊 {Math.round(volume * 100)}%</span>

        <select
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[0.5, 1, 1.25, 1.5, 2].map((r) => (
            <option key={r} value={r}>
              {r}x
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            const el = playerRef.current?.getInternalPlayer()?.getIframe?.();
            if (el?.requestFullscreen) el.requestFullscreen();
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🔍 Zoom
        </button>
      </div>
    </div>
  );
}
