import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { API_URL } from "astro:env/client";
import { useNavigate } from "react-router-dom";

type CourseR = {
  id: number;
  title: string;
  description: string;
  teacher_name: string;
  enrolled?: boolean;
};

export default function CourseEnrollment() {
  const [userId, setUserId] = useState<number | null>(null);
  const [courses, setCourses] = useState<CourseR[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) return;
    const user = JSON.parse(data);
    setUserId(user.id);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCourses(userId);
    }
  }, [userId]);

  const fetchCourses = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/courses/enrollments/${id}`);
      const result = await res.json();
      setCourses(result);
    } catch (err: any) {
      toast.error("Gagal memuat course");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, course_id: courseId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal daftar course");
      }

      toast.success("Berhasil mendaftar course");
      fetchCourses(userId!);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!userId) {
    return (
      <p className="text-center text-red-500 mt-6">
        Silakan login terlebih dahulu.
      </p>
    );
  }

  return (
    <div className="max-w-full mx-auto px-2 sm:max-w-3xl py-4">
      <h2 className="text-lg sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Daftar Course
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada course tersedia.</p>
      ) : (
        <>
          {/* 👇 Table untuk layar besar */}
          <div className="hidden sm:block bg-white rounded-xl shadow p-4 overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">Judul</th>
                  <th className="border px-4 py-2 text-left">Deskripsi</th>
                  <th className="border px-4 py-2 text-left">Guru</th>
                  <th className="border px-4 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border px-4 py-2">{course.title}</td>
                    <td className="border px-4 py-2">{course.description}</td>
                    <td className="border px-4 py-2">{course.teacher_name}</td>
                    <td className="border px-4 py-2 text-center">
                      {course.enrolled ? (
                        <span className="text-green-600 font-semibold">
                          Sudah Terdaftar
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEnroll(course.id)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                        >
                          Daftar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 👇 Card view untuk mobile */}
          <div className="sm:hidden space-y-4">
            <p className="text-sm text-gray-500">
              Swipe ke bawah untuk melihat daftar...
            </p>
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow p-4 space-y-2"
              >
                <h3 className="font-bold text-base">{course.title}</h3>
                <p className="text-sm text-gray-700">{course.description}</p>
                <p className="text-sm text-gray-500">
                  Guru: {course.teacher_name}
                </p>
                {course.enrolled ? (
                  <p className="text-green-600 font-semibold text-sm">
                    Sudah Terdaftar
                  </p>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Daftar
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
