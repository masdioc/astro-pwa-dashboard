import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";
import { timeAgo } from "../helpers/timeAgo";
import toast from "react-hot-toast";

interface LastReadItem {
  user_id: number;
  name: string;
  username: string;
  surah_nomor: string;
  surah_nama: string;
  ayat_nomor: number;
  updated_at: string;
  status_validasi: "baik" | "benar" | "kurang" | null;
}

export default function LastReadMonitor() {
  const [data, setData] = useState<LastReadItem[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateStatus = async (
    user_id: number,
    surah_nomor: string,
    ayat_nomor: number,
    status: "baik" | "benar" | "kurang" | ""
  ) => {
    try {
      await fetch(`${API_URL}/api/last-read/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          surah_nomor,
          ayat_nomor,
          status_validasi: status,
        }),
      });
      console.log(user_id, surah_nomor, ayat_nomor);
      setData((prev) =>
        prev.map((item) =>
          item.user_id === user_id &&
          item.surah_nomor === surah_nomor &&
          item.ayat_nomor === ayat_nomor
            ? { ...item, status_validasi: status === "" ? null : status }
            : item
        )
      );

      toast.success("✅ Status validasi berhasil disimpan");
    } catch (err) {
      console.error("Gagal update status:", err);
      toast.error("❌ Gagal update status");
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/last-read/all`)
      .then((res) => res.json())
      .then((json) => setData(json.data || []))
      .catch((err) => console.error("Gagal fetch:", err));
  }, []);

  const filtered = data.filter((item) => {
    const target =
      `${item.name} ${item.username} ${item.surah_nama}`.toLowerCase();
    return target.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📋 Baca Qur'an terakhir</h1>
      <input
        type="text"
        placeholder="Cari nama, username, atau surah..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border text-left">Nama</th>
              <th className="px-4 py-2 border text-left">Username</th>
              <th className="px-4 py-2 border text-left">Surah</th>
              <th className="px-4 py-2 border text-center">Ayat</th>
              <th className="px-4 py-2 border text-left">Waktu</th>
              <th className="px-4 py-2 border text-left">Validasi</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((item, i) => (
                <tr
                  key={i}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition"
                >
                  <td className="px-4 py-2 border text-center">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="px-4 py-2 border">{item.name}</td>
                  <td className="px-4 py-2 border">{item.username}</td>
                  <td className="px-4 py-2 border">
                    {item.surah_nomor}. {item.surah_nama}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {item.ayat_nomor}
                  </td>
                  <td className="px-4 py-2 border text-gray-600 dark:text-gray-400">
                    {timeAgo(item.updated_at)}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={item.status_validasi || ""}
                      onChange={(e) =>
                        updateStatus(
                          item.user_id,
                          item.surah_nomor,
                          item.ayat_nomor,
                          e.target.value as "baik" | "benar" | "kurang" | ""
                        )
                      }
                      className="px-2 py-1 text-sm rounded border dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">-</option>
                      <option value="baik">Baik</option>
                      <option value="benar">Benar</option>
                      <option value="kurang">Kurang</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
