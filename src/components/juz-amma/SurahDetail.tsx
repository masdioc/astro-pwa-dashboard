import React, { useEffect, useState, useRef } from "react";
import { BASE_URL } from "astro:env/client";
import { API_URL } from "astro:env/client";
import toast from "react-hot-toast";

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
  const [showTranslation, setShowTranslation] = useState(false);
  const [showLatin, setShowLatin] = useState(false);
  const [fontSize, setFontSize] = useState(35);
  const [keterangan, setKeterangan] = useState<string>("");
  const [audioPerAyat, setAudioPerAyat] = useState<Record<number, string>>({});
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nomorInt = parseInt(nomor);

  const toArabicNumber = (num: number): string =>
    num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

  useEffect(() => {
    fetch(`/data/surah/surah${nomor}.json`)
      .then((res) => res.json())
      .then((data) => {
        setAyat(data.ayat || []);
      });

    fetch("/data/durasi-ayat1.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (d: any) => d.no_surah === parseInt(nomor)
        );
        const mapping: Record<number, string> = {};
        filtered.forEach((d: any) => {
          mapping[d.no_ayah] = d.url_audio;
        });
        if (nomorInt !== 9) {
          mapping[0] = "/data/audio/bismillah.mp3";
        }
        setAudioPerAyat(mapping);
      });
  }, [nomor]);

  useEffect(() => {
    if (playingAyat !== null) {
      const element = document.getElementById(`ayat-${playingAyat}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [playingAyat]);

  const playNextAyat = (current: number) => {
    const next = current + 1;
    if (!audioPerAyat[next]) {
      setPlayingAyat(null);
      return;
    }
    setPlayingAyat(next);
    if (audioRef.current) {
      audioRef.current.src = audioPerAyat[next];
      audioRef.current.play();
    }
  };

  const togglePlayAyat = (ayatKe: number) => {
    if (playingAyat === ayatKe) {
      audioRef.current?.pause();
      setPlayingAyat(null);
    } else {
      if (!audioPerAyat[ayatKe]) return toast.error("Audio tidak ditemukan");
      setPlayingAyat(ayatKe);
      if (audioRef.current) {
        audioRef.current.src = audioPerAyat[ayatKe];
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-2">{nama}</h2>

      <audio
        ref={audioRef}
        onEnded={() => playingAyat !== null && playNextAyat(playingAyat)}
        hidden
      />

      {nomorInt !== 9 && (
        <div
          id="ayat-0"
          className={`text-center my-6 rtl font-arabic leading-loose transition-all ${
            playingAyat === 0
              ? "ring-2 ring-yellow-400 dark:ring-yellow-500 rounded-lg"
              : ""
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
          <div className="flex justify-center mt-2">
            <button
              onClick={() => togglePlayAyat(0)}
              className={`text-xl ${
                playingAyat === 0 ? "text-red-600" : "text-green-600"
              }`}
              title={playingAyat === 0 ? "Hentikan" : "Putar Bismillah"}
            >
              {playingAyat === 0 ? "⏸️" : "▶️"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <button
          onClick={() => setShowTranslation((prev) => !prev)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showTranslation ? "Sembunyikan Terjemahan" : "Tampilkan Terjemahan"}
        </button>

        <button
          onClick={() => setShowLatin((prev) => !prev)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showLatin ? "Sembunyikan Latin" : "Tampilkan Latin"}
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
            <div
              key={i}
              id={`ayat-${i + 1}`}
              className={`relative text-right border-b border-gray-200 dark:border-gray-700 pb-5 pt-6 transition-all ${
                playingAyat === i + 1
                  ? "ring-2 ring-yellow-400 dark:ring-yellow-500 rounded-lg"
                  : ""
              }`}
            >
              <div
                className="rtl font-arabic my-4 text-right"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
              >
                {a.arabic}{" "}
                <span
                  className="font-bold text-blue-600 dark:text-blue-400"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {toArabicNumber(i + 1)}
                </span>
              </div>
              <div className="flex gap-2 justify-end mb-2">
                <button
                  onClick={() => togglePlayAyat(i + 1)}
                  className={`text-xl ${
                    playingAyat === i + 1 ? "text-red-600" : "text-green-600"
                  }`}
                  title={
                    playingAyat === i + 1 ? "Hentikan" : `Putar ayat ${i + 1}`
                  }
                >
                  {playingAyat === i + 1 ? "⏸️" : "▶️"}
                </button>
                <button
                  onClick={() => {
                    const user = localStorage.getItem("user");
                    if (!user) return;
                    localStorage.setItem(
                      "lastRead",
                      JSON.stringify({
                        surah: nomor,
                        nama,
                        ayat: i + 1,
                        timestamp: Date.now(),
                      })
                    );
                    toast.success(
                      `📌 Ayat ${i + 1} disimpan sebagai terakhir dibaca`
                    );
                  }}
                  title="Tandai terakhir dibaca"
                  className="w-10 h-10 text-lg font-bold rounded-full border border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  🔖
                </button>
              </div>
              {showLatin && (
                <div
                  className="italic mr-10 text-gray-700 dark:text-gray-300"
                  style={{ fontSize: `${fontSize - 10}px` }}
                >
                  {a.latin}
                </div>
              )}
              {showTranslation && (
                <div
                  className="text-left mt-1 text-gray-800 dark:text-gray-200"
                  style={{ fontSize: `${fontSize - 14}px` }}
                >
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
    </div>
  );
};

export default SurahDetail;
