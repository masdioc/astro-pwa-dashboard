import React, { useEffect, useState, useRef } from "react";
import { API_URL } from "astro:env/client";
import YouTube from "react-youtube";

interface Module {
  id: number;
  title: string;
}

interface Material {
  id: number;
  module_id: number;
  title: string;
  content: string;
  video_url: string;
}

function isYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}

function getYoutubeId(url: string): string {
  const regex =
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]+)/;
  const match = url.match(regex);
  return match ? match[1] : "";
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export default function CourseModuleMaterialDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [durationPlayed, setDurationPlayed] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
      } catch (e) {
        console.error("Gagal parse user dari localStorage:", e);
      }
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/modules`)
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => console.error("Failed to fetch modules:", err));
  }, []);

  useEffect(() => {
    if (selectedModuleId !== null) {
      fetch(`${API_URL}/api/modules/${selectedModuleId}/materials`)
        .then((res) => res.json())
        .then((data) => setMaterials(data))
        .catch((err) => console.error("Failed to fetch materials:", err));
    }
  }, [selectedModuleId]);

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setDurationPlayed((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const logActivity = async (
    materialId: number,
    status: "play" | "pause" | "ended"
  ) => {
    if (!userId) return;
    const durasiMenit = parseFloat((durationPlayed / 60).toFixed(2));

    await fetch(`${API_URL}/api/courselog`, {
      method: "POST", // UPDATE jika sudah ada log
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        material_id: materialId,
        status,
        tanggal: getTodayDate(),
        durasi: durasiMenit,
      }),
    });
  };

  const handlePlay = (materialId: number) => {
    startTimer();
    logActivity(materialId, "play");
  };

  const handlePause = (materialId: number) => {
    stopTimer();
    logActivity(materialId, "pause");
  };

  const handleEnd = (materialId: number) => {
    stopTimer();
    logActivity(materialId, "ended");
    setDurationPlayed(0);
  };

  if (!userId) {
    return (
      <div className="text-center mt-20 text-gray-600">
        ⚠️ Silakan login terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Modul */}
        <div className="col-span-1">
          <div className="bg-white rounded-xl shadow border p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📚 Daftar Modul
            </h2>
            <ul className="divide-y divide-gray-200">
              {modules.map((mod) => (
                <li
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`p-3 cursor-pointer rounded hover:bg-blue-50 transition ${
                    selectedModuleId === mod.id
                      ? "bg-blue-100 font-medium text-blue-700"
                      : ""
                  }`}
                >
                  {mod.title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Konten Materi */}
        <div className="col-span-1 md:col-span-3">
          <div className="bg-white rounded-xl shadow border p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📝 Materi Pembelajaran
            </h2>

            {selectedModuleId === null ? (
              <p className="text-gray-500">
                Pilih modul terlebih dahulu untuk melihat materi.
              </p>
            ) : materials.length === 0 ? (
              <p className="text-gray-500">Belum ada materi untuk modul ini.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {mat.title}
                    </h3>

                    {isYouTubeUrl(mat.video_url) ? (
                      <>
                        <div className="aspect-video mb-2">
                          <YouTube
                            videoId={getYoutubeId(mat.video_url)}
                            className="w-full h-full rounded"
                            opts={{
                              width: "100%",
                              height: "100%",
                              playerVars: {
                                modestbranding: 1,
                                rel: 0,
                              },
                            }}
                            onPlay={() => handlePlay(mat.id)}
                            onPause={() => handlePause(mat.id)}
                            onEnd={() => handleEnd(mat.id)}
                          />
                        </div>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {mat.content}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {mat.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
