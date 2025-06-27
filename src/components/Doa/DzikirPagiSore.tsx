import React from "react";

interface DzikirItem {
  waktu: string;
  judul: string;
  arab: string;
  latin: string;
  terjemah: string;
  jumlah: number;
}

const DzikirPagiSoreList: React.FC<{ dzikirData: DzikirItem[] }> = ({
  dzikirData,
}) => {
  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        🌅 Dzikir Pagi & Sore
      </h1>

      <div className="space-y-8">
        {dzikirData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-700">
                {item.judul}
              </h2>
              <span className="text-xs sm:text-sm text-white bg-green-600 px-3 py-1 rounded-full">
                {item.waktu}
              </span>
            </div>

            <p className="text-2xl sm:text-3xl text-right font-serif text-gray-900 leading-snug mb-4 overflow-x-auto">
              {item.arab}
            </p>

            <p className="text-base sm:text-lg italic text-gray-700 mb-2">
              <strong>Latin:</strong> {item.latin}
            </p>

            <p className="text-base sm:text-lg text-gray-700 mb-2">
              <strong>Terjemah:</strong> {item.terjemah}
            </p>

            <p className="text-sm sm:text-base text-gray-500">
              <strong>Jumlah Bacaan:</strong> {item.jumlah}x
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default DzikirPagiSoreList;
