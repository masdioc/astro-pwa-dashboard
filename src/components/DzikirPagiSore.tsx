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
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        🌅 Dzikir Pagi & Sore
      </h1>

      <div className="space-y-10">
        {dzikirData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-blue-700">
                {item.judul}
              </h2>
              <span className="text-sm text-white bg-green-600 px-2 py-1 rounded-full">
                {item.waktu}
              </span>
            </div>

            <p className="text-4xl text-right font-serif text-gray-900 leading-snug mb-4">
              {item.arab}
            </p>

            <p className="text-lg italic text-gray-700 mb-2">
              <strong>Latin:</strong> {item.latin}
            </p>

            <p className="text-lg text-gray-700 mb-2">
              <strong>Terjemah:</strong> {item.terjemah}
            </p>

            <p className="text-base text-gray-500">
              <strong>Jumlah Bacaan:</strong> {item.jumlah}x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DzikirPagiSoreList;
