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

  useEffect(() => {
    
    fetch(`/data/surah${nomor}.json`)
      .then((res) => res.json())
      .then((data) => {
        setAyat(data.data.ayat || []);
       
      
      });
       fetch("/data/list_surah.json")
      .then((res) => res.json())
      .then((list) => {
        const surat = list.find((s: any) => s.nomor === nomor);
           const mp3 = BASE_URL+"/data/audio/"+nomor+".mp3"; 
            if (mp3) setSuratAudioUrl(mp3); 
  if (surat) setKeterangan(surat.keterangan);
      });

  }, [nomor]);
   const  addToHafalan = async (nomor: string, nama: string) => {
  const item = localStorage.getItem("user");
  if (!item) {
    toast.error("⚠️ Data user tidak ditemukan");
    return;
  }

  const user = JSON.parse(item);
  // toast.success(user.id);
      //  toast.success("🧠 Surah ditambahkan ke hafalan! 💪 Semangat!");
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
    // console.error("Error:", error);
    toast.error("❌ Terjadi kesalahan.");
  }
};

  const nomorInt = parseInt(nomor);
  const [showInfo, setShowInfo] = useState(false);

const toArabicNumber = (num: number): string =>
  num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]); 
  return (
    
    <div className="p-4 bg-[#fdfaf2] dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-center mb-1">{nama}</h2>

     <div className="flex justify-between items-center mb-4">
  <a href="/surahIndex" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
    ← Kembali ke Daftar Surah
  </a>

  <button
    onClick={() => setShowInfo(true)}
    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
  >
    ℹ️ Keterangan
  </button>
   <button
      onClick={() => addToHafalan(nomor, nama)}
      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
    >
      + Hafalan
    </button>
</div>
{showInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-left relative">
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
  className="font-serif inline-flex items-center gap-2 justify-end flex-wrap"
  style={{ fontSize: `${fontSize}px`, lineHeight: "1.6" }}
>
  <span>{a.arabic}</span>
 <span className="inline-block min-w-[40px] text-center font-bold rounded-full border border-gray-400 dark:border-gray-500 px-2 py-0.5 text-lg">
                 {toArabicNumber(i + 1)}
                </span>
</div>

  <div className="text-lg text-gray-700 dark:text-gray-300 italic mr-10">{a.latin}</div>
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
        {nomorInt > 77 ? (
          <a
            href={`/surah/${nomorInt - 1}`}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Sebelumnya
          </a>
        ) : (
          <div />
        )}

        {nomorInt < 114 ? (
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
