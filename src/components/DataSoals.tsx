import React, { useEffect, useState } from "react";
// import Layout from "./layout";
const apiUrl = "https://api.app-metodejariyah.com";
interface User {
  id: number;
   jenis_soal: string;
    level_soal: number;
  question: string; 
  a: string;
  b: string;
  c: string;
  d: string;
  answer:string;
  explanation: string;
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
  fetch(apiUrl+"/api/soals")
    .then((res) => res.json())
    .then((data) => {
      console.log("Data loaded:", data);
      setUsers(data.soals);
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
            `${u.question}`.toLowerCase().includes(term) 
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
    <h1 className="text-2xl md:text-3xl font-bold mb-4">Data Soal</h1>

    {/* Filter dan Tombol */}
    <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
      <input
        type="text"
        placeholder="Cari soal..."
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
          + Tambah Soal
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
                <th className="border px-4 py-2 text-left">#</th>
                           <th className="border px-4 py-2 text-left">Jenis</th>
                                      <th className="border px-4 py-2 text-left">Level</th>
                <th className="border px-4 py-2 text-left">Question</th>
                <th className="border px-4 py-2 text-left">Option A</th>
                      <th className="border px-4 py-2 text-left">Option B</th>
                             <th className="border px-4 py-2 text-left">Option C</th>
                                    <th className="border px-4 py-2 text-left">Option D</th>
                                           <th className="border px-4 py-2 text-left">Answer</th> 

                <th className="border px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
          <tbody>
  {pageData.map((soal, index) => (
    <tr key={soal.id} className="hover:bg-blue-50 transition">
      <td className="px-4 py-2 border-b">
        {(currentPage - 1) * pageSize + index + 1}
      </td>
       <td className="px-4 py-2 border-b">{soal.jenis_soal}</td>
        <td className="px-4 py-2 border-b">{soal.level_soal}</td>
      <td className="px-4 py-2 border-b">{soal.question}</td>
      <td className="px-4 py-2 border-b">{soal.a}</td>
      <td className="px-4 py-2 border-b">{soal.b}</td>
      <td className="px-4 py-2 border-b">{soal.c}</td>
      <td className="px-4 py-2 border-b">{soal.d}</td>
      <td className="px-4 py-2 border-b">{soal.answer}</td>
      <td className="px-4 py-2 border-b">
        <button
          onClick={() => setDetailUser(soal)}
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
    <div className="animate-fade-in-scale bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
      <button
        onClick={() => setDetailUser(null)}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        ✕
      </button>
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Detail Soal</h3>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
        <p><strong>Pertanyaan:</strong> {detailUser.question}</p>
        <p><strong>A:</strong> {detailUser.a}</p>
        <p><strong>B:</strong> {detailUser.b}</p>
        <p><strong>C:</strong> {detailUser.c}</p>
        <p><strong>D:</strong> {detailUser.d}</p>
        <p><strong>Jawaban:</strong> {detailUser.answer.toUpperCase()}</p>
        <p><strong>Pembahasan:</strong> {detailUser.explanation}</p>
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
