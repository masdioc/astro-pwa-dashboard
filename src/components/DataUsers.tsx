import React, { useEffect, useState } from "react";
// import Layout from "./layout";

interface User {
  id: number;
  name: string;
  // lastName: string;
  email: string;
  phone: string;
  gender: string;
  address: { address: string; city: string };
  company: { name: string };
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
  fetch("https://api.app-metodejariyah.com/api/users")
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
  <div className="p-4 max-w-screen-xl mx-auto">
    <h1 className="text-2xl md:text-3xl font-bold mb-4">Data Pengguna</h1>

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
          + Tambah Pengguna
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Nama</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
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

        {/* Navigasi halaman */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Detail User */}
        {detailUser && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded shadow text-sm">
            <h3 className="text-lg font-semibold mb-2">Detail Pengguna</h3>
            <p><strong>Nama:</strong> {detailUser.name}</p>
            <p><strong>Email:</strong> {detailUser.email}</p>
            <p><strong>Phone:</strong> {detailUser.phone}</p>
            <p><strong>Gender:</strong> {detailUser.gender}</p>
            <p><strong>Alamat:</strong> {detailUser.address.address}, {detailUser.address.city}</p>
            <p><strong>Perusahaan:</strong> {detailUser.company.name}</p>
            <button
              onClick={() => setDetailUser(null)}
              className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
            >
              Tutup
            </button>
          </div>
        )}
      </>
    )}
  </div>
 

    </>
  );
}
