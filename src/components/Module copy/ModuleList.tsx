import React, { useEffect, useState } from "react";
import ModuleFormModal from "./ModuleForm"; // Ganti dari ModuleForm
import { API_URL } from "astro:env/client";

interface Module {
  id: number;
  title: string;
  order_index: number;
  course_id: number;
}

interface Props {
  courseId: number;
}

const ModuleList: React.FC<Props> = ({ courseId }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [editing, setEditing] = useState<Module | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchModules = async () => {
    const res = await fetch(`${API_URL}/api/modules?course_id=${courseId}`);
    const data = await res.json();
    setModules(data);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin hapus modul?")) {
      await fetch(`${API_URL}/api/modules/${id}`, { method: "DELETE" });
      fetchModules();
    }
  };

  const openModal = (mod?: Module) => {
    setEditing(mod || null);
    setShowModal(true);
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Modul</h3>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Tambah Modul
        </button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Judul</th>
            <th className="p-2">Urutan</th>
            <th className="p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((mod) => (
            <tr key={mod.id} className="border-t">
              <td className="p-2">{mod.title}</td>
              <td className="p-2">{mod.order_index}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => openModal(mod)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mod.id)}
                  className="text-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <ModuleFormModal
        courseId={courseId}
        selected={editing}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSaved={fetchModules}
      />
    </div>
  );
};

export default ModuleList;
