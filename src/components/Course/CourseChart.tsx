import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_URL } from "astro:env/client";

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface LogBelajar {
  tanggal: string;
  durasi: number;
}

export default function GrafikBelajar() {
  const [dataLog, setDataLog] = useState<LogBelajar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    fetch(`${API_URL}/api/courselog/${user.id}/recap`)
      .then((res) => res.json())
      .then((data) => {
        setDataLog(data);
        setLoading(false);
      })
      .catch((err) => console.error("Gagal ambil data log:", err));
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10">
        Loading grafik belajar...
      </p>
    );

  const chartData = {
    labels: dataLog.map((log) => log.tanggal),
    datasets: [
      {
        label: "Durasi Belajar (menit)",
        data: dataLog.map((log) => log.durasi),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📈 Grafik Perkembangan Belajar
      </h2>
      <Line data={chartData} />
    </div>
  );
}
