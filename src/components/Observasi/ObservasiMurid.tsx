import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface itemData {
  user_id: number;
  observasi_id: number;
  observasi: string;
  updated_at: string;
  praktek: "Ya" | "Tidak" | "";
  teori: "Ya" | "Tidak" | "";
}
export default function ObservasiMurid() {
  const [data, setData] = useState<itemData[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { userId } = useParams();
  console.log(userId);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/get-observasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });
      const json = await res.json();

      const normalized = (json.data || []).map((item: any) => ({
        ...item,
        praktek: item.status_praktek ?? "",
        teori: item.status_teori ?? "",
      }));

      setData(normalized);
    } catch (err) {
      console.error("Gagal fetch:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (
    user_id: number,
    observasi_id: number,
    type: "status_praktek" | "status_teori",
    value: "Ya" | "Tidak" | ""
  ) => {
    try {
      await fetch(`${API_URL}/api/update-observasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id, observasi_id, [type]: value }),
      });

      toast.success(`✅ Status ${type} berhasil disimpan`);
      await fetchData(); // << refetch semua data dari server
    } catch (err) {
      console.error(`Gagal update ${type}:`, err);
      toast.error(`❌ Gagal update status ${type}`);
    }
  };

  const createObservasi = async () => {
    // const userStr = localStorage.getItem("user");
    // const parsedUser = userStr ? JSON.parse(userStr) : null;
    // const userId = parsedUser?.id;

    if (!userId) {
      toast.error(`❌ User ID tidak ditemukan di localStorage`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/add-observasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Gagal request");

      toast.success("✅ Observasi baru berhasil dibuat");
      await fetchData();
    } catch (err) {
      console.error("Gagal membuat observasi:", err);
      toast.error("❌ Gagal membuat observasi");
    }
  };

  const filtered = data.filter((item) =>
    item.observasi.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📋 Observasi Murid
        </h1>

        <div className="flex gap-2">
          <button
            onClick={createObservasi}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            ➕ <span className="hidden sm:inline">Buat Observasi</span>
          </button>

          <a
            href="/observasi_report"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            🧾 <span className="hidden sm:inline">Lihat Laporan</span>
          </a>
        </div>
      </div>

      <input
        type="text"
        placeholder="Cari Observasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      {/* Tabel Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border text-left">Observasi</th>
              <th className="px-4 py-2 border text-left">Praktek</th>
              <th className="px-4 py-2 border text-left">Teori</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, i) => (
              <tr
                key={i}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition"
              >
                <td className="px-4 py-2 border text-center">
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </td>
                <td className="px-4 py-2 border">{item.observasi}</td>
                <td className="px-4 py-2 border">
                  <select
                    value={item.praktek || ""}
                    onChange={(e) =>
                      updateStatus(
                        item.user_id,
                        item.observasi_id,
                        "status_praktek",
                        e.target.value as any
                      )
                    }
                    className="px-2 py-1 text-sm rounded border dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">-</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </td>
                <td className="px-4 py-2 border">
                  <select
                    value={item.teori || ""}
                    onChange={(e) =>
                      updateStatus(
                        item.user_id,
                        item.observasi_id,
                        "status_teori",
                        e.target.value as any
                      )
                    }
                    className="px-2 py-1 text-sm rounded border dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">-</option>
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card Mobile */}
      <div className="md:hidden space-y-4">
        {paginated.map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow"
          >
            <div className="text-sm text-gray-500 mb-1">
              #{(currentPage - 1) * itemsPerPage + i + 1}
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">
              {item.observasi}
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Praktek:
              </label>
              <select
                value={item.praktek || ""}
                onChange={(e) =>
                  updateStatus(
                    item.user_id,
                    item.observasi_id,
                    "status_praktek",
                    e.target.value as any
                  )
                }
                className="px-2 py-1 text-sm rounded border dark:bg-gray-800 dark:text-white"
              >
                <option value="">-</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teori:
              </label>
              <select
                value={item.teori || ""}
                onChange={(e) =>
                  updateStatus(
                    item.user_id,
                    item.observasi_id,
                    "status_teori",
                    e.target.value as any
                  )
                }
                className="px-2 py-1 text-sm rounded border dark:bg-gray-800 dark:text-white"
              >
                <option value="">-</option>
                <option value="Ya">Ya</option>
                <option value="Tidak">Tidak</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="px-3 py-1 text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
