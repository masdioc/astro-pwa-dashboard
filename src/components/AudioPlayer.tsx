import React, { useRef, useState, useEffect } from "react";
import { BASE_URL } from "astro:env/client";
interface Surah {
  asma: string;
  nomor: string;
  nama: string;
  arti: string;
  audio: string;
  keterangan: string;
}

interface AudioPlayerProps {
  audioList: Surah[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioList }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const baseUrl = `${BASE_URL}/data/audio/`;
  const currentSurah = audioList[currentIndex];

  useEffect(() => {
    if (!currentSurah || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = baseUrl + currentSurah.audio;
    audio.play().catch((e) => {
      console.error("Gagal memutar:", e);
    });
  }, [currentIndex, currentSurah]);

  const handleEnded = () => {
    if (currentIndex < audioList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-white max-w-md mx-auto">
      <p className="text-4xl  font-serif text-center text-gray-900 leading-snug mb-4">
        {currentSurah.asma}
      </p>
      <p className="text-center text-lg font-bold mb-1">
        {currentSurah.nomor}. {currentSurah.nama} ({currentSurah.arti})
      </p>
      <p className="text-center text-lg  mb-1">{currentSurah.keterangan}</p>
      <p className="text-center text-sm text-gray-500 mb-2">
        Sedang memutar: {currentIndex + 1} / {audioList.length}
      </p>

      <audio ref={audioRef} controls onEnded={handleEnded} className="w-full" />

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Sebelumnya
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, audioList.length - 1))
          }
          disabled={currentIndex === audioList.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
