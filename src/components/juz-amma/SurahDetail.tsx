import React, { useEffect, useState } from "react";
 

type Ayat = {
  arabic: string;
  latin: string;
  translation: string;
};

interface Props {
  nomor: string;
  nama: string;
}

const SurahDetail: React.FC<Props> = ({ nomor, nama }) => {
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(42);
  const [suratAudioUrl, setSuratAudioUrl] = useState("");

  useEffect(() => {
    fetch(`/data/surah${nomor}.json`)
      .then((res) => res.json())
      .then((data) => {
        setAyat(data.data.ayat || []);
      });

    // Load audio dari list_surah.json
    fetch("/data/list_surah.json")
      .then((res) => res.json())
      .then((list) => {
        const surat = list.find((s: any) => s.nomor === nomor);
        if (surat?.audio) setSuratAudioUrl(surat.audio);
      });
  }, [nomor]);

  const nomorInt = parseInt(nomor);

  return (
    <div className="p-4 bg-[#fdfaf2] dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-1">{nama}</h2>

      <div className="text-left mt-2 mb-4">
        <a href="/surahIndex" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
          ← Kembali ke Daftar Surah
        </a>
      </div>

      {suratAudioUrl && (
        <audio controls className="w-full mb-4">
          <source src={suratAudioUrl} type="audio/mpeg" />
          Browser tidak mendukung audio.
        </audio>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <button
          onClick={() => setShowTranslation((prev) => !prev)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showTranslation ? "Sembunyikan Terjemahan" : "Tampilkan Terjemahan"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFontSize((size) => Math.max(20, size - 2))}
            className="px-2 py-1 text-sm border rounded dark:border-gray-600"
          >
            A−
          </button>
          <button
            onClick={() => setFontSize((size) => Math.min(64, size + 2))}
            className="px-2 py-1 text-sm border rounded dark:border-gray-600"
          >
            A+
          </button>
        </div>
      </div>

      <div className="space-y-3 leading-snug">
        {ayat.length > 0 ? (
          ayat.map((a, i) => (
            <div key={i} className="text-right border-b border-gray-200 dark:border-gray-700 pb-3">
              <div
                className="font-serif"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
              >
                {a.arabic}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 italic">{a.latin}</div>
              {showTranslation && (
                <div className="text-base text-gray-800 dark:text-gray-200 text-left">
                  {a.translation}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Tidak ada ayat untuk surat ini.
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-300 dark:border-gray-700">
        {nomorInt > 1 ? (
          <a
            href={`/surah/${nomorInt - 1}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Sebelumnya
          </a>
        ) : (
          <div />
        )}

        {nomorInt < 77 ? (
          <a
            href={`/surah/${nomorInt + 1}`}
            className="text-blue-600 dark:text-blue-400 hover:underline ml-auto"
          >
            Selanjutnya →
          </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default SurahDetail;
