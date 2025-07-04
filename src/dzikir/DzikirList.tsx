import React from "react";

interface DzikirItem {
  urutan: number;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
  jumlah: number;
}

const DzikirList: React.FC<{ dzikirData: DzikirItem[] }> = ({ dzikirData }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-12">
        🕌 Dzikir Harian
      </h1>
      <div>
        {dzikirData.map((item) => (
          <div
            key={item.urutan}
            className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">
              {item.urutan}. {item.judul}
            </h2>
            {/* <p className="text-4xl text-right font-serif text-gray-900 leading-snug mb-4">
              {item.arab}
            </p> */}
            <div
              className="rtl font-arabic text-right"
              style={{ fontSize: `36px`, lineHeight: "1.6" }}
            >
              {item.arab}
            </div>
            <p className="text-lg text-gray-700 italic mb-2">
              <strong>Latin:</strong> {item.latin}
            </p>
            <p className="text-lg text-gray-700 mb-2">
              <strong>Terjemah:</strong> {item.terjemah}
            </p>
            <p className="text-base text-gray-500">
              <strong>Jumlah:</strong> {item.jumlah}x
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DzikirList;
