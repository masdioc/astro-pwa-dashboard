import React from "react";

interface DoaItem {
  id: number;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
  keterangan: string;
  audio?: string;
}

const DoaList: React.FC<{ doaData: DoaItem[] }> = ({ doaData }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-12">
        🕋 Kumpulan Doa Setelah Salat
      </h1>
      <div className="space-y-0">
        {doaData.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-green-700 mb-2">
              {item.judul}
            </h2>

            {/* <p className="text-3xl text-right font-serif text-gray-900 leading-snug mb-4 pr-4">
              {item.arab}
            </p> */}

            <div
              className="rtl font-arabic text-right"
              style={{ fontSize: `36px`, lineHeight: "1.6" }}
            >
              {item.arab}
            </div>

            <p className="text-lg italic text-gray-700 mb-2">
              <strong>Latin:</strong> {item.latin}
            </p>

            <p className="text-lg text-gray-700 mb-2">
              <strong>Terjemah:</strong> {item.terjemah}
            </p>

            <p className="text-base text-gray-500 mb-2">
              <strong>Keterangan:</strong> {item.keterangan}
            </p>

            {/* {item.audio && (
              <audio controls className="mt-3">
                <source src={item.audio} type="audio/mpeg" />
                Browser tidak mendukung pemutar audio.
              </audio>
            )} */}
          </div>
        ))}
      </div>
    </>
  );
};

export default DoaList;
