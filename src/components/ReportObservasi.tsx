import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "astro:env/client";
import html2pdf from "html2pdf.js";
import "html2pdf.js/dist/html2pdf.bundle";

interface ObservasiItem {
  observasi_id: number;
  observasi: string;
  praktek: "Ya" | "Tidak";
  teori: "Ya" | "Tidak";
}

export default function ReportObservasi() {
  const [data, setData] = useState<ObservasiItem[]>([]);
  const [namaUser, setNamaUser] = useState("Nama Siswa");
  const reportRef = useRef<HTMLDivElement>(null); // ✅ referensi elemen untuk PDF

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let userId = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
        setNamaUser(user.name || "Nama Siswa");
      } catch (err) {
        console.error("Gagal parsing user:", err);
      }
    }

    if (!userId) return;

    fetch(`${API_URL}/api/get-observasi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json.data)) {
          setData(json.data);
        } else {
          console.error("Data tidak valid:", json);
        }
      })
      .catch((err) => {
        console.error("Gagal fetch data observasi:", err);
      });
  }, []);

  // ✅ Export PDF
  const exportToPDF = () => {
    if (!reportRef.current) return;

    html2pdf()
      .from(reportRef.current)
      .set({
        margin: 0.5,
        filename: `report-observasi-${namaUser}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Tombol Export */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">📝 Report Hasil Observasi</h1>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          📄 Export PDF
        </button>
      </div>

      {/* Bagian yang akan di-export */}
      <div
        ref={reportRef}
        className="bg-white dark:bg-gray-900 text-black dark:text-white p-4 rounded shadow"
      >
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Nama Peserta: <strong>{namaUser}</strong>
        </p>

        <table className="w-full border-collapse border border-gray-400 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2 text-left">Observasi</th>
              <th className="border p-2 text-center">Praktek</th>
              <th className="border p-2 text-center">Teori</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.observasi_id}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
              >
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.observasi}</td>
                <td
                  className={`border p-2 text-center ${
                    item.praktek === "Ya" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.praktek}
                </td>
                <td
                  className={`border p-2 text-center ${
                    item.teori === "Ya" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {item.teori}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Dicetak pada: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
