import React, { useState } from "react";

type Surah = {
  nama: string;
  arti: string;
  nomor: string;
  type: string;
  audio: string;
};

interface Props {
  surahList: Surah[];
}

const SurahList: React.FC<Props> = ({ surahList }) => {
  const [keyword, setKeyword] = useState("");

  const filteredSurah = surahList.filter((surah) =>
    (surah.nama + " " + surah.arti + " " + surah.nomor)
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Cari surat..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      <div className="grid grid-cols-1 gap-3">
        {filteredSurah.length > 0 ? (
          filteredSurah.map((surah) => (
            <a
              key={surah.nomor}
              href={`/surah/${surah.nomor}`}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="text-xl font-semibold dark:text-white">{surah.nama}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 italic">{surah.arti}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{surah.type.toUpperCase()}</div>
            </a>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">Tidak ditemukan.</div>
        )}
      </div>
    </div>
  );
};

export default SurahList;
