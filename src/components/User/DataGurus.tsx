import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";
interface User {
  id: number;
  name: string;
  // lastName: string;
  email: string;
  level: string;
  guru: string;
  provinsi_nama: string;
  kabupaten_nama: string;
  kecamatan_nama: string;
  desa_nama: string;
}

export default function UserDataPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailUser, setDetailUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(API_URL + "/api/users/role/guru")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data loaded:", data);
        setUsers(data.users);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Gagal memuat data");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFiltered(
        users.filter(
          (u) =>
            `${u.name}`.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        )
      );
    } else {
      setFiltered([]);
    }
  }, [searchTerm, users]);

  const list = searchTerm ? filtered : users;
  const totalPages = Math.ceil(list.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = list.slice(start, end);

  return (
    <>
      <div className="w-screen h-screen overflow-x-auto flex flex-col p-4 max-w-screen-xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Data Guru</h1>

        {/* Filter dan Tombol */}
        <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="px-4 py-2 border rounded w-full md:max-w-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => alert("Export belum diimplementasikan")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
            >
              Export Excel
            </button>
            <button
              onClick={() => alert("Fitur tambah belum diimplementasikan")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
            >
              + Tambah
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-blue-600 mb-4">⏳ Memuat data...</div>
        ) : (
          <>
            {/* Page Size */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <label htmlFor="pageSize" className="font-medium">
                Tampilkan
              </label>
              <select
                id="pageSize"
                className="border px-2 py-1 rounded"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>baris per halaman</span>
            </div>

            {/* Tabel */}
            {/* TABLE view untuk desktop/tablet */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">ID</th>
                    <th className="border px-4 py-2 text-left">Nama</th>
                    <th className="border px-4 py-2 text-left">Email</th>
                    <th className="border px-4 py-2 text-left">Pendidikan</th>
                    <th className="border px-4 py-2 text-left">Provinsi</th>
                    <th className="border px-4 py-2 text-left">Kab/Kota</th>
                    <th className="border px-4 py-2 text-left">Kecamatan</th>
                    <th className="border px-4 py-2 text-left">Desa/Kel.</th>
                    <th className="border px-4 py-2 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50 transition">
                      <td className="px-4 py-2 border-b">{user.id}</td>
                      <td className="px-4 py-2 border-b">{user.name}</td>
                      <td className="px-4 py-2 border-b">{user.email}</td>
                      <td className="px-4 py-2 border-b">{user.level}</td>
                      <td className="px-4 py-2 border-b">
                        {user.provinsi_nama}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {user.kabupaten_nama}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {user.kecamatan_nama}
                      </td>
                      <td className="px-4 py-2 border-b">{user.desa_nama}</td>
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => setDetailUser(user)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CARD view untuk mobile */}
            <div className="md:hidden space-y-4">
              {pageData.map((user) => (
                <div
                  key={user.id}
                  className="bg-white border border-gray-300 rounded-lg p-4 shadow"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    ID: {user.id}
                  </div>
                  <div className="text-base font-semibold text-gray-800">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <strong>Email:</strong> {user.email}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong> Pendidikan:</strong> {user.level}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong> Guru:</strong> {user.guru}
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => setDetailUser(user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigasi halaman */}
            <div className="flex flex-row flex-nowrap justify-between items-center mt-4 gap-2 overflow-x-auto">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            {/* Detail User */}
            {detailUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative">
                  <button
                    onClick={() => setDetailUser(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:text-gray-300"
                  >
                    ✕
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
                    Detail Pengguna
                  </h2>
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    <p>
                      <strong>ID:</strong> {detailUser.id}
                    </p>
                    <p>
                      <strong>Nama:</strong> {detailUser.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {detailUser.email}
                    </p>
                    <p>
                      <strong>Pendidikan:</strong> {detailUser.level}
                    </p>
                    <p>
                      <strong>Guru:</strong> {detailUser.level}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => setDetailUser(null)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
