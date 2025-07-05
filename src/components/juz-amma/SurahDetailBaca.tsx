import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "astro:env/client";
import toast from "react-hot-toast";
import { BASE_URL } from "astro:env/client";

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
  const [fontSize, setFontSize] = useState(36);
  const [playingAyat, setPlayingAyat] = useState<number | null>(null);
  const [durasiMap, setDurasiMap] = useState<Record<number, number>>({});
  const [audioUrlMap, setAudioUrlMap] = useState<Record<number, string>>({});
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [mode, setMode] = useState<Mode>("scroll");
  const [progress, setProgress] = useState(0);
  const [ayatProgress, setAyatProgress] = useState<Record<number, number>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
        const url_mp3 = filtered.forEach((d: any) => {
          const url_audio_mp3 = `${BASE_URL}/data/audio/mp3/compress/${d.url_audio}`;
          durasi[d.no_ayah] = d.durasi_ms;
          audio[d.no_ayah] = url_audio_mp3;
        });
        if (nomorInt !== 9) {
          durasi[0] = 6113;
          const bismillahAudio = data.find(
            (d: any) => d.no_surah === 1 && d.no_ayah === 1
          )?.url_audio_mp3;
          audio[0] = bismillahAudio || "/data/audio/mp3/compress/001001.mp3";
        }
        setDurasiMap(durasi);
        setAudioUrlMap(audio);
      });
  }, [nomor]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (playingAyat !== null) {
      const el = document.getElementById(`ayat-${playingAyat}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      simpanTerakhirDibaca(playingAyat);
    }
  }, [playingAyat]);

  const stopAutoScroll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
      const url = audioUrlMap[index];
      const isAudioMode = mode === "audio" || mode === "both";

      if (isAudioMode && audioRef.current && url) {
        const audio = audioRef.current;
        audio.src = url;
        audio.play().catch(() => {});

        setAyatProgress((prev) => ({ ...prev, [index]: 0 }));

        intervalRef.current = setInterval(() => {
          if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            setAyatProgress((prev) => ({ ...prev, [index]: percent }));
          }
        }, 100);

        audio.onended = () => {
          clearInterval(intervalRef.current!);
          index++;
          if (index < ayat.length) {
            scrollNext();
          } else {
            toast.success("✅ Selesai membaca surah ini!");
            setAutoScrollActive(false);
            setProgress(100);
            setPlayingAyat(null);
          }
        };
      } else {
        const durasi = durasiMap[index] ?? 3000;
        setAyatProgress((prev) => ({ ...prev, [index]: 100 }));
        timerRef.current = setTimeout(() => {
          index++;
          if (index < ayat.length) {
            scrollNext();
          } else {
            toast.success("✅ Selesai membaca surah ini!");
            setAutoScrollActive(false);
            setProgress(100);
            setPlayingAyat(null);
          }
        }, durasi);
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
      <div className="fixed top-0 left-0 right-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
          <div className="flex gap-1">
            {["scroll", "audio"].map((m) => (
              <button
                key={m}
                onClick={() => changeMode(m as Mode)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              >
                {m === "scroll" ? "📜 Scroll" : "🔊 Audio"}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => startAutoScroll()}
              disabled={autoScrollActive}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:bg-gray-400"
            >
              ▶️
            </button>
            <button
              onClick={lanjutkanTerakhirDibaca}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
            >
              ⏩
            </button>
            {autoScrollActive && (
              <button
                onClick={stopAutoScroll}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                ⏹️
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {showTranslation ? "Sembunyikan Terjemah" : "Tampilkan Terjemah"}
            </button>
            <button
              onClick={() => setShowLatin(!showLatin)}
              className="text-blue-600 dark:text-blue-400 underline"
            >
              {showLatin ? "Sembunyikan Latin" : "Tampilkan Latin"}
            </button>
          </div>
        </div>

        {autoScrollActive && (
          <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="pt-24 px-4 max-w-3xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">{nama}</h1>
        <audio ref={audioRef} hidden />

        <div className="space-y-6">
          {ayat.map((a, i) => (
            <div
              key={i}
              id={`ayat-${i}`}
              className={`py-6 px-3 rounded-lg transition-all duration-300 ${
                playingAyat === i
                  ? "bg-yellow-100 dark:bg-yellow-300/10 ring-2 ring-yellow-400 dark:ring-yellow-500"
                  : "hover:bg-gray-50 dark:hover:bg-gray-200/10"
              }`}
            >
              <div
                className="rtl font-arabic text-right leading-loose"
                style={{ fontSize: `${fontSize}px` }}
              >
                {a.arabic}
                <span className="ml-2 text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  ({toArabicNumber(i)})
                </span>
              </div>
              {/* {playingAyat === i && (
                <div className="mt-2 w-full bg-gray-300/50 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex justify-end">
                  <div
                    className="bg-blue-600 h-full transition-all duration-100"
                    style={{
                      width: `${ayatProgress[i] || 0}%`,
                    }}
                  ></div>
                </div>
              )} */}

              {playingAyat === i && (
                <div className="mt-2 flex justify-end">
                  <div className="relative">
                    <div className="bg-gray-300/50 dark:bg-gray-700 h-2 rounded-full overflow-hidden w-full">
                      <div
                        className="bg-blue-600 h-full transition-all duration-100 origin-right"
                        style={{
                          width: `${ayatProgress[i] || 0}%`,
                          transform: "scaleX(1)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {showLatin && (
                <div className="mt-2 italic text-base text-gray-700 dark:text-gray-300">
                  {a.latin}
                </div>
              )}
              {showTranslation && (
                <div className="mt-1 text-base text-gray-800 dark:text-gray-200">
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
