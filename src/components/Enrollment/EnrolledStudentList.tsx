import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../helpers/timeAgo";

interface Student {
  id: number;
  course_title: string;
  student_name: string;
  enrolled_at: string;
}

const EnrolledStudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/enrollments`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data siswa:", err);
        setLoading(false);
      });
  }, []);

  const filteredStudents = students.filter((student) =>
    student.student_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Daftar Siswa Enroll
        </h2>

        <input
          type="text"
          placeholder="Cari nama siswa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b text-left">No</th>
                  <th className="p-3 border-b text-left">Nama Siswa</th>
                  <th className="p-3 border-b text-left">Kursus</th>
                  <th className="p-3 border-b text-left">Tanggal Enroll</th>
                  <th className="p-3 border-b text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      Tidak ada siswa ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{index + 1}</td>
                      <td className="p-3 border-b">{student.student_name}</td>
                      <td className="p-3 border-b">{student.course_title}</td>
                      <td className="p-3 border-b">
                        {timeAgo(student.enrolled_at)}
                      </td>
                      <td className="p-3 border-b text-center">
                        <button
                          onClick={() =>
                            navigate(`/observasi/observasi_murid/${student.id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        >
                          Observasi
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentList;
