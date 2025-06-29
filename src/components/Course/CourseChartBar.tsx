import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_URL } from "astro:env/client";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface LogBelajar {
  tanggal: string;
  durasi: number;
}

export default function GrafikBelajarBar() {
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
        Memuat grafik belajar...
      </p>
    );

  const chartData = {
    labels: dataLog.map((log) => {
      const date = new Date(log.tanggal);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date
        .toLocaleString("id-ID", {
          month: "short",
        })
        .replace(".", "");
      return `${day}-${month}`;
    }),
    datasets: [
      {
        label: "Durasi Belajar (menit)",
        data: dataLog.map((log) => log.durasi),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.parsed.y} menit`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Durasi (menit)" },
      },
      x: {
        title: { display: true, text: "Tanggal" },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        📊 Grafik Durasi Belajar
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
