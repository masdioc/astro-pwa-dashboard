import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";

interface LogBelajar {
  tanggal: string;
  nama_siswa: string;
  title?: string;
  durasi: number;
}

export default function MonitorBelajarTable() {
  const [logs, setLogs] = useState<LogBelajar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const user = JSON.parse(storedUser);
    fetch(`${API_URL}/api/courselog/${user.id}/recaptable`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => console.error("Gagal ambil data log:", err));
  }, []);

  const formatTanggal = (tanggal: string) => {
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-6 overflow-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📋 Monitor Belajar Siswa
      </h2>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <table className="min-w-full table-auto text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border">Nama Siswa</th>
              <th className="px-4 py-2 border">Materi</th>
              <th className="px-4 py-2 border text-right">Durasi (menit)</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">
                  {formatTanggal(log.tanggal)}
                </td>
                <td className="px-4 py-2 border">{log.nama_siswa}</td>
                <td className="px-4 py-2 border">{log.title || "-"}</td>
                <td className="px-4 py-2 border text-right">{log.durasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
