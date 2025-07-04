import React, { useEffect, useRef, useState } from "react";
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

type Mode = "scroll" | "audio" | "both";

const SurahDetailBaca: React.FC<Props> = ({ nomor, nama }) => {
  const [ayat, setAyat] = useState<Ayat[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showLatin, setShowLatin] = useState(false);
  const [fontSize, setFontSize] = useState(35);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [durasiMap, setDurasiMap] = useState<Record<number, number>>({});
  const [audioUrlMap, setAudioUrlMap] = useState<Record<number, string>>({});
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [mode, setMode] = useState<Mode>("scroll");
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const nomorInt = parseInt(nomor);

  const toArabicNumber = (num: number): string =>
    num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

  const simpanTerakhirDibaca = async (ayatKe: number) => {
    const item = localStorage.getItem("user");
    if (!item) return;
    const user = JSON.parse(item);
    localStorage.setItem(
      "lastRead",
      JSON.stringify({
        surah: nomor,
        nama,
        ayat: ayatKe,
        timestamp: Date.now(),
      })
    );

    try {
      await fetch(`${API_URL}/api/last-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          surah_nomor: nomor,
          surah_nama: nama,
          ayat_nomor: ayatKe,
        }),
      });
    } catch (err) {
      console.warn("Gagal simpan ke server:", err);
    }
  };

  useEffect(() => {
    fetch(`/data/surah/surah${nomor}.json`)
      .then((res) => res.json())
      .then((data) => {
        const ayatData = data.ayat || [];
        if (nomorInt !== 9) {
          ayatData.unshift({
            arabic: "بِسْمِ اللهِ الرَّحْمَـنِ الرَّحِيمِ",
            latin: "Bismillāhir-raḥmānir-raḥīm",
            translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang",
          });
        }
        setAyat(ayatData);
      });

    fetch("/data/durasi-ayat1.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((d: any) => d.no_surah === nomorInt);
        const durasi: Record<number, number> = {};
        const audio: Record<number, string> = {};
        filtered.forEach((d: any) => {
          durasi[d.no_ayah] = d.durasi_ms;
          audio[d.no_ayah] = d.url_audio;
        });
        if (nomorInt !== 9) {
          durasi[0] = 6113;
          // Ambil audio dari surat 1 ayat 1 (Al-Fatihah ayat pertama) sebagai bismillah
          const bismillahAudio = data.find(
            (d: any) => d.no_surah === 1 && d.no_ayah === 1
          )?.url_audio;
          if (bismillahAudio) {
            audio[0] = bismillahAudio;
          } else {
            audio[0] = "/data/audio/bismillah.mp3";
          }
        }
        setDurasiMap(durasi);
        setAudioUrlMap(audio);
      });
  }, [nomor]);

  useEffect(() => {
    if (playingAyat !== null) {
      const el = document.getElementById(`ayat-${playingAyat}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        simpanTerakhirDibaca(playingAyat);
      }
    }
  }, [playingAyat]);

  const stopAutoScroll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAutoScrollActive(false);
    setPlayingAyat(null);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const startAutoScroll = (fromAyat: number = 0) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    setAutoScrollActive(true);
    let index = fromAyat;

    const scrollNext = () => {
      setPlayingAyat(index);
      setProgress(Math.round((index / ayat.length) * 100));
      const durasi = durasiMap[index] ?? 3000;

      if (
        (mode === "audio" || mode === "both") &&
        audioRef.current &&
        audioUrlMap[index]
      ) {
        audioRef.current.src = audioUrlMap[index];
        audioRef.current.play().catch(() => {});
      }

      index++;
      if (index < ayat.length) {
        timerRef.current = setTimeout(scrollNext, durasi);
      } else {
        toast.success("✅ Selesai membaca surah ini!");
        setAutoScrollActive(false);
        setProgress(100);
      }
    };

    scrollNext();
  };

  const lanjutkanTerakhirDibaca = () => {
    const local = localStorage.getItem("lastRead");
    if (!local) return toast("Belum ada data terakhir dibaca");
    try {
      const data = JSON.parse(local);
      if (data.surah === nomor && data.ayat) {
        startAutoScroll(data.ayat);
      }
    } catch (e) {
      console.warn("Gagal membaca lastRead", e);
    }
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  return (
    <div className="relative">
      <div className="fixed top-2 left-2 right-2 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-lg px-3 py-2 flex flex-wrap justify-between items-center gap-2 text-sm shadow-md">
        <div className="flex gap-1">
          <button
            onClick={() => changeMode("scroll")}
            className={`px-2 py-1 rounded ${
              mode === "scroll"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Scroll
          </button>
          <button
            onClick={() => changeMode("audio")}
            className={`px-2 py-1 rounded ${
              mode === "audio"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Audio
          </button>
          {/* <button
            onClick={() => changeMode("both")}
            className={`px-2 py-1 rounded ${
              mode === "both"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Gabung
          </button> */}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => startAutoScroll()}
            disabled={autoScrollActive}
            className="px-2 py-1 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            ▶️
          </button>
          <button
            onClick={lanjutkanTerakhirDibaca}
            className="px-2 py-1 bg-yellow-500 text-white rounded"
          >
            ⏩
          </button>
          {autoScrollActive && (
            <button
              onClick={stopAutoScroll}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              ⏹️
            </button>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowTranslation((prev) => !prev)}
            className="underline text-blue-600 dark:text-blue-400"
          >
            {showTranslation ? "Hide Terjemah" : "Tampilkan Terjemah"}
          </button>
          <button
            onClick={() => setShowLatin((prev) => !prev)}
            className="underline text-blue-600 dark:text-blue-400"
          >
            {showLatin ? "Hide Latin" : "Tampilkan Latin"}
          </button>
        </div>
        {autoScrollActive && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="p-4 pt-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-[90%] mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">{nama}</h2>

        <audio ref={audioRef} hidden />

        <div className="space-y-3">
          {ayat.map((a, i) => (
            <div
              key={i}
              id={`ayat-${i}`}
              className={`relative border-b pb-5 pt-6 transition-all ${
                playingAyat === i
                  ? "ring-2 ring-yellow-400 dark:ring-yellow-500 rounded-lg"
                  : ""
              }`}
            >
              <div
                className="rtl font-arabic text-right"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
              >
                {a.arabic}{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {toArabicNumber(i)}
                </span>
              </div>
              {showLatin && (
                <div className="italic text-gray-700 dark:text-gray-300">
                  {a.latin}
                </div>
              )}
              {showTranslation && (
                <div className="text-left text-gray-800 dark:text-gray-200">
                  {a.translation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurahDetailBaca;
