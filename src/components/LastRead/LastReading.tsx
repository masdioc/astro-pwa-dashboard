import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";

type LastRead = {
  surah: string;
  nama: string;
  ayat: number;
};

export default function LastReadButton() {
  const [last, setLast] = useState<LastRead | null>(null);

  useEffect(() => {
    // 1. Coba dari localStorage
    const local = localStorage.getItem("lastRead");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.surah && parsed.ayat) {
          setLast(parsed);
          return; // tidak lanjut ke server
        }
      } catch (e) {
        console.warn("Format lastRead di localStorage rusak:", e);
      }
    }

    // 2. Coba ambil dari server jika tidak ada di local
    const userItem = localStorage.getItem("user");
    if (!userItem) return;

    const user = JSON.parse(userItem);
    // console.log(user);

    fetch(`${API_URL}/api/last-read?user_id=${user.id}&_=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.surah_nomor && data?.ayat_nomor) {
          setLast({
            surah: data.surah_nomor,
            nama: data.surah_nama || "Surah",
            ayat: data.ayat_nomor,
          });

          // opsional: simpan juga ke localStorage agar cepat saat buka lagi
          localStorage.setItem(
            "lastRead",
            JSON.stringify({
              surah: data.surah_nomor,
              nama: data.surah_nama,
              ayat: data.ayat_nomor,
              timestamp: Date.now(),
            })
          );
        }
      })
      .catch((err) => console.error("Gagal ambil last-read dari server:", err));
  }, []);

  if (!last) return null;

  return (
    <a
      href={`/surah/${last.surah}#ayat-${last.ayat}`}
      className="block w-full mb-4 px-4 py-3 text-center bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-lg shadow hover:bg-yellow-200 dark:hover:bg-yellow-700 transition"
    >
      🔖 Lanjutkan {last.nama} ayat {last.ayat}
    </a>
  );
}
