import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function ImportSoal() {
  const [status, setStatus] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Validasi dan ubah format ke API
      const soalList = (jsonData as any[]).map((item) => ({
        question: item.question,
        a: item.a,
        b: item.b,
        c: item.c,
        d: item.d,
        answer: item.answer?.toLowerCase(),
        explanation: item.explanation || "",
      }));

      // Kirim ke API satu per satu (atau bisa juga batch)
      const responses = await Promise.all(
        soalList.map((soal) =>
          fetch("http://localhost:3000/api/soals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(soal),
          })
        )
      );

      if (responses.every((res) => res.ok)) {
        setStatus(`✅ Berhasil mengimpor ${soalList.length} soal.`);
      } else {
        setStatus("⚠️ Beberapa soal gagal diimpor.");
      }
    } catch (error) {
      console.error("Gagal memproses file:", error);
      setStatus("❌ Gagal membaca atau mengimpor file Excel.");
    }
  };

  return (
    <div className="p-4 border rounded bg-white max-w-md mx-auto shadow">
      <h2 className="text-lg font-bold mb-4">📥 Import Soal dari Excel</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="mb-2"
      />
      <p className="text-sm text-gray-600 mb-2">
        Format kolom wajib: <code>question</code>, <code>a</code>, <code>b</code>, <code>c</code>, <code>d</code>, <code>answer</code>, <code>explanation</code>.
      </p>
      {status && <div className="mt-2 text-sm">{status}</div>}
    </div>
  );
}
