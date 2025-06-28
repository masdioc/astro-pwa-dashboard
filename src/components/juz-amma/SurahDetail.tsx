import React, { useEffect, useState } from "react";
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
  const [showTranslation, setShowTranslation] = useState(true);
  const [fontSize, setFontSize] = useState(35);
  const [keterangan, setKeterangan] = useState<string>("");
  const [suratAudioUrl, setSuratAudioUrl] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const nomorInt = parseInt(nomor);

  const toArabicNumber = (num: number): string =>
    num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

  useEffect(() => {
    // ambil data ayat
    fetch(`/data/surah/surah${nomor}.json`)
      .then((res) => res.json())
      .then((data) => {
        setAyat(data.ayat || []);
      });

    // set audio
    const formatted = String(nomor).padStart(3, "0");
    const mp3 = `${BASE_URL}/data/audio/${formatted}.mp3`;
    setSuratAudioUrl(mp3);
  }, [nomor]);
  useEffect(() => {
    if (!ayat.length) return;

    const local = localStorage.getItem("lastRead");
    let done = false;

    if (local) {
      try {
        const data = JSON.parse(local);
        if (data.surah === nomor && data.ayat) {
          const el = document.getElementById(`ayat-${data.ayat}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            el.classList.add("ring-2", "ring-blue-400", "rounded-lg");
            setTimeout(
              () => el.classList.remove("ring-2", "ring-blue-400"),
              3000
            );
            done = true;
          }
        }
      } catch (e) {
        console.warn("Gagal baca localStorage:", e);
      }
    }

    // Jika belum berhasil scroll, ambil dari server (fallback)
    if (!done) {
      const item = localStorage.getItem("user");
      if (!item) return;
      const user = JSON.parse(item);
      // console.log(user);

      fetch(`${API_URL}/api/last-read?user_id=${user.id}&_=${Date.now()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.surah_nomor === nomor && data.ayat_nomor) {
            const el = document.getElementById(`ayat-${data.ayat_nomor}`);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              el.classList.add("animate-pulse");
              setTimeout(() => el.classList.remove("animate-pulse"), 8000);
            }
          }
        });
    }
  }, [ayat, nomor]);

  const [saving, setSaving] = useState(false);
  const simpanTerakhirDibaca = async (ayatKe: number) => {
    const item = localStorage.getItem("user");
    if (!item) return;

    const user = JSON.parse(item);

    // ⏱ Simpan ke localStorage (REAL-TIME)
    localStorage.setItem(
      "lastRead",
      JSON.stringify({
        surah: nomor,
        nama,
        ayat: ayatKe,
        timestamp: Date.now(),
      })
    );
    toast.success(`📌 Ayat ${ayatKe} disimpan sebagai terakhir dibaca`);
    // ⏳ Simpan ke server (async)
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
      console.error("Gagal simpan ke server:", err);
    }
  };

  const addToHafalan = async () => {
    const item = localStorage.getItem("user");
    if (!item) {
      toast.error("⚠️ Data user tidak ditemukan");
      return;
    }

    const user = JSON.parse(item);

    try {
      const res = await fetch(`${API_URL}/api/hafalan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          surah_nomor: nomor,
          surah_nama: nama,
        }),
      });

      if (res.ok) {
        toast.success("🧠 Surah ditambahkan ke hafalan! 💪 Semangat!");
      } else {
        toast.error("❌ Gagal menyimpan.");
      }
    } catch (error) {
      toast.error("❌ Terjadi kesalahan.");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-center mb-2">{nama}</h2>

      {/* Navigasi Atas */}
      <div className="flex justify-between items-center text-sm mb-4 text-blue-600 dark:text-blue-400">
        {nomorInt > 1 ? (
          <a href={`/surah/${nomorInt - 1}`} className="hover:underline">
            ← Sebelumnya
          </a>
        ) : (
          <div />
        )}
        <a href="/surahIndex" className="block text-center hover:underline">
          📖 Daftar Surah
        </a>
        {nomorInt < 114 ? (
          <a href={`/surah/${nomorInt + 1}`} className="hover:underline">
            Selanjutnya →
          </a>
        ) : (
          <div />
        )}
      </div>

      {/* Tombol Keterangan & Hafalan */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowInfo(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ℹ️ Keterangan
        </button>
        <button
          onClick={addToHafalan}
          className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Hafalan
        </button>
      </div>

      {/* Modal Info */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-2">Tentang Surat {nama}</h3>
            <p
              className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: keterangan }}
            />
          </div>
        </div>
      )}

      {/* Audio */}
      {suratAudioUrl && (
        <audio controls className="w-full mb-4">
          <source src={suratAudioUrl} type="audio/mpeg" />
          Browser tidak mendukung audio.
        </audio>
      )}

      {/* Kontrol Terjemahan & Font */}
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

      {/* Daftar Ayat */}
      <div className="space-y-3 leading-snug">
        {ayat.length > 0 ? (
          ayat.map((a, i) => (
            <div
              key={i}
              id={`ayat-${i + 1}`}
              className="relative text-right border-b border-gray-200 dark:border-gray-700 pb-5 pt-6"
            >
              <div
                className="font-serif inline-flex items-center gap-2 justify-end flex-wrap text-right"
                style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
              >
                {/* <p className="text-right text-2xl leading-snug">{a.arabic}</p> */}
                <p className="text-right text-2xl font-indonesia leading-snug">
                  {a.arabic}
                </p>
                <button
                  onClick={() => simpanTerakhirDibaca(i + 1)}
                  title="Tandai terakhir dibaca"
                  className="absolute top-0 right-0 w-12 h-12 text-2xl font-bold rounded-full border border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {toArabicNumber(i + 1)}
                </button>
              </div>

              <div className="text-base text-gray-700 dark:text-gray-300 italic mr-10">
                {a.latin}
              </div>

              {showTranslation && (
                <div className="text-sm text-gray-800 dark:text-gray-200 text-left mt-1">
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

      {/* Navigasi Bawah */}
      <div className="flex justify-between text-sm mt-10 pt-4 border-t border-gray-200 dark:border-gray-700">
        {nomorInt > 1 ? (
          <a
            href={`/surah/${nomorInt - 1}`}
            className="text-blue-600 hover:underline"
          >
            ← Sebelumnya
          </a>
        ) : (
          <div />
        )}

        {nomorInt < 114 ? (
          <a
            href={`/surah/${nomorInt + 1}`}
            className="text-blue-600 hover:underline ml-auto"
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
``;
