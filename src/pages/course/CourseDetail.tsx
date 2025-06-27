import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";

interface Material {
  id: number;
  title: string;
  type: string;
  content_url: string;
}

interface Module {
  id: number;
  title: string;
  order_index: number;
  materials: Material[];
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
}

export default function CourseDetail({ courseId }: { courseId: number }) {
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/courses/${courseId}/full`)
      .then((res) => res.json())
      .then(setCourse);
  }, [courseId]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-gray-700 mb-6">{course.description}</p>

      {course.modules.map((mod) => (
        <div key={mod.id} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {mod.order_index}. {mod.title}
          </h2>
          <ul className="space-y-2 pl-4">
            {mod.materials.map((mat) => (
              <li key={mat.id} className="flex items-center gap-2">
                <span className="font-medium">{mat.title}</span>
                <a
                  href={mat.content_url}
                  target="_blank"
                  className="text-blue-600 underline text-sm"
                >
                  Lihat {mat.type}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
