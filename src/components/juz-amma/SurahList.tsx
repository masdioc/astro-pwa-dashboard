import React, { useRef, useState } from "react";
import { BASE_URL } from "astro:env/client";
import { BookOpen, Headphones } from "lucide-react"; // optional icon lib

export default function SurahList({ surahList }: { surahList: any[] }) {
  const [query, setQuery] = useState("");
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = surahList.filter((surah) => {
    const target = `${surah.nama} ${surah.arti} ${surah.asma}`.toLowerCase();
    return target.includes(query.toLowerCase());
  });

  const handlePlay = (nomor: number, index: number) => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    const formatted = String(nomor).padStart(3, "0");
    const url = `${BASE_URL}data/audio/${formatted}.mp3`;
    const audio = new Audio(url);
    audioRefs.current[index] = audio;
    setActiveIndex(index);
    audio.play();
  };

  return (
    <>
      <input
        type="text"
        placeholder="🔍 Cari surah..."
        className="w-full mb-6 px-5 py-3 text-lg border rounded-2xl shadow-md focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((surah, index) => (
          <div
            key={surah.nomor}
            onClick={() =>
              (window.location.href = `/surah_baca/${surah.nomor}`)
            }
            className="cursor-pointer px-6 py-5 rounded-2xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all shadow-lg border border-gray-200 dark:border-gray-700 group"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-blue-300">
                  {surah.nomor}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:underline">
                    {surah.nama}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {surah.arti} • {surah.type} • {surah.ayat} ayat
                  </p>
                </div>
              </div>
              <div className="text-3xl font-arabic text-gray-800 dark:text-white">
                {surah.asma}
              </div>
            </div>

            {/* <div className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 mt-2">
              <BookOpen className="w-4 h-4" />
              <span>Baca & Dengar Surat</span>
            </div> */}
          </div>
        ))}
      </div>
    </>
  );
}
