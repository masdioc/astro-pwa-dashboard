import React, { useRef, useState } from "react";
import { BASE_URL } from "astro:env/client";

export default function SurahList({ surahList }: { surahList: any[] }) {
  const [query, setQuery] = useState("");
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({});
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = surahList.filter((surah) => {
    const target = `${surah.nama} ${surah.arti} ${surah.asma}`.toLowerCase();
    return target.includes(query.toLowerCase());
  });

  const handlePlay = (nomor: number, index: number) => {
    // pause semua dulu
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });

    // set src dan play
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
        placeholder="Cari surah..."
        className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((surah, index) => (
          <div
            key={surah.nomor}
            className="block px-4 py-3 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {surah.nomor}. {surah.nama}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {surah.arti} • {surah.type} • {surah.ayat} ayat
                </p>
              </div>
              <span className="text-2xl font-arabic text-right text-gray-800 dark:text-white">
                {surah.asma}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
   {/* <button
 onClick={() => handlePlay(`data/audio/${formatted}.mp3`, index)}
  
  className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
>
  ▶️ Putar
</button> */}


              <a
                href={`/surah/${surah.nomor}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Buka Surat →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
