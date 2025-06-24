import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";
import { timeAgo } from "../helpers/timeAgo";
import toast from "react-hot-toast";

interface item {
  user_id: number;
  observasi_id: number;
  observasi: string;
  updated_at: string;
  praktek: "Ya" | "Tidak";
  teori: "Ya" | "Tidak";
}

export default function LastReadMonitor() {
  const [data, setData] = useState<item[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const updateStatusPraktek = async (
    user_id: number,
    observasi_id: number,
    praktek: "Ya" | "Tidak"
  ) => {
    try {
      await fetch(`${API_URL}/api/update-observasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          observasi_id,
          praktek,
        }),
      });
      // console.log(user_id, observasi_id, praktek, teori);
      // setData((prev) =>
      //   prev.map((item) =>
      //     item.user_id === user_id &&
      //     item.observasi_id === observasi_id
      //       ? { ...item, praktek: praktek === "" ? null : status }
      //       : item
      //   )
      // );

      toast.success("✅ Status validasi berhasil disimpan");
    } catch (err) {
      console.error("Gagal update status:", err);
      toast.error("❌ Gagal update status");
    }
  };
  const updateStatusTeori = async (
    user_id: number,
    observasi_id: number,
    teori: "Ya" | "Tidak"
  ) => {
    try {
      await fetch(`${API_URL}/api/update-observasi`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          observasi_id,
          teori,
        }),
      });
      // console.log(user_id, observasi_id, praktek, teori);
      // setData((prev) =>
      //   prev.map((item) =>
      //     item.user_id === user_id &&
      //     item.observasi_id === observasi_id
      //       ? { ...item, praktek: praktek === "" ? null : status }
      //       : item
      //   )
      // );

      toast.success("✅ Status validasi berhasil disimpan");
    } catch (err) {
      console.error("Gagal update status:", err);
      toast.error("❌ Gagal update status");
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let userId = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
      } catch (err) {
        console.error("Gagal parsing user:", err);
        return;
      }
    }

    if (!userId) {
      console.error("userId tidak ditemukan di localStorage");
      return;
    }

    fetch(`${API_URL}/api/get-observasi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }), // kirim body
    })
      .then((res) => res.json())
      .then((json) => setData(json.data || []))
      .catch((err) => console.error("Gagal fetch:", err));
  }, []);

  const filtered = data.filter((item) => {
    const target = `${item.observasi}`.toLowerCase();
    return target.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const createObservasi = async () => {
    const localUser = localStorage.getItem("user");
    const parsedUser = localUser ? JSON.parse(localUser) : null;
    const userId = parsedUser?.id;

    if (!userId) {
      toast.error(`❌ User ID tidak ditemukan di localStorage ${parsedUser}`);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/add-observasi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("Request gagal");

      toast.success("✅ Observasi telah dibuat");

      // Refresh data observasi setelah insert
      const res2 = await fetch(`${API_URL}/api/get-observasi`);
      const json2 = await res2.json();
      setData(json2.data || []);
    } catch (err) {
      console.error("Gagal membuat observasi:", err);
      toast.error("❌ Gagal membuat observasi");
    }
  };

  return (
    <div className="p-1 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📋 Observasi Murid
        </h1>

        <div className="flex gap-2">
          <button
            onClick={createObservasi}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            ➕ <span className="hidden sm:inline">Create Observasi</span>
          </button>

          <button
            onClick={() => (window.location.href = "/observasi_report")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            🧾 <span className="hidden sm:inline">View Report</span>
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Cari Observasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full p-2 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      {/* TABEL untuk layar md ke atas */}
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
                      updateStatusPraktek(
                        item.user_id,
                        item.observasi_id,
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
                    value={item.praktek || ""}
                    onChange={(e) =>
                      updateStatusTeori(
                        item.user_id,
                        item.observasi_id,
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

      {/* CARD-VIEW untuk layar kecil */}
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
                  updateStatusPraktek(
                    item.user_id,
                    item.observasi_id,
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
                value={item.praktek || ""}
                onChange={(e) =>
                  updateStatusTeori(
                    item.user_id,
                    item.observasi_id,
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
