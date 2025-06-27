import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import { API_URL } from "astro:env/client";

interface Course {
  id?: number;
  title: string;
  description: string;
  teacher_id: number;
}

interface Teacher {
  id: number;
  name: string;
}

const CourseForm: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Course>({
    title: "",
    description: "",
    teacher_id: 0,
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [filterTeacherId, setFilterTeacherId] = useState("");
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filterTeacherId) params.append("teacher_id", filterTeacherId);
    if (search) params.append("search", search);

    const res = await fetch(`${API_URL}/api/courses?${params.toString()}`);
    const result = await res.json();
    setCourses(result.data);
    setTotalPages(result.pagination?.totalPages || 1);
  };

  const fetchTeachers = async () => {
    const res = await fetch(`${API_URL}/api/users?role=guru`);
    const data = await res.json();
    setTeachers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filterTeacherId, search]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${API_URL}/api/courses/${editId}`
        : `${API_URL}/api/courses`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Terjadi kesalahan");
      }

      toast.success(
        editId ? "Berhasil update course" : "Berhasil menambahkan course"
      );
      setForm({ title: "", description: "", teacher_id: 0 });
      setEditId(null);
      setShowModal(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAdd = () => {
    setForm({ title: "", description: "", teacher_id: 0 });
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setForm(course);
    setEditId(course.id!);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus course ini?")) {
      const res = await fetch(`${API_URL}/api/courses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Berhasil menghapus course");
        fetchCourses();
      } else {
        const err = await res.json();
        toast.error(err.message || "Gagal menghapus course");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ title: "", description: "", teacher_id: 0 });
    setEditId(null);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(courses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    XLSX.writeFile(wb, "courses.xlsx");
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manajemen Course</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          + Tambah Course
        </button>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">
              {editId ? "Edit Course" : "Tambah Course"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Judul"
                value={form.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                required
              />
              <textarea
                name="description"
                placeholder="Deskripsi"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded shadow-sm"
              ></textarea>
              <select
                name="teacher_id"
                value={form.teacher_id}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded shadow-sm"
                required
              >
                <option value="">Pilih Guru</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter dan tabel */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <select
            value={filterTeacherId}
            onChange={(e) => {
              setPage(1);
              setFilterTeacherId(e.target.value);
            }}
            className="border rounded p-2 shadow-sm"
          >
            <option value="">Semua guru</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cari judul..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="border p-2 rounded flex-1 shadow-sm"
          />
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Export Excel
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-2">Daftar Courses</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 rounded shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Judul</th>
                <th className="border px-4 py-2 text-left">Deskripsi</th>
                <th className="border px-4 py-2 text-left">Guru</th>
                <th className="border px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {(page - 1) * limit + i + 1}
                  </td>
                  <td className="border px-4 py-2">{c.title}</td>
                  <td className="border px-4 py-2">{c.description}</td>
                  <td className="border px-4 py-2">
                    {teachers.find((t) => t.id === c.teacher_id)?.name || "-"}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id!)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
