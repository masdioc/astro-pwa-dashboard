import React, { useEffect, useState } from "react";
import ModuleFormModal from "../Module/ModuleFormModal";
import MaterialFormModal from "../Material/MaterialFormModal";
import MaterialList from "../Material/MaterialList";
import { API_URL } from "astro:env/client";

interface Module {
  id: number;
  title: string;
  order_index: number;
  course_id: number;
}

interface Material {
  id: number;
  title: string;
  content: string;
  module_id: number;
}

const CourseModuleMaterialPage: React.FC<{ courseId: number }> = ({
  courseId,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModuleEdit, setSelectedModuleEdit] = useState<Module | null>(
    null
  );

  const fetchModules = async () => {
    try {
      const res = await fetch(`${API_URL}/api/modules?course_id=${courseId}`);
      if (!res.ok) throw new Error("Gagal memuat modul");
      const data = await res.json();
      setModules(data);
      if (!selectedModuleId && data.length > 0) {
        setSelectedModuleId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
    }
  };

  const fetchMaterials = async () => {
    if (!selectedModuleId) return;
    try {
      const res = await fetch(
        `${API_URL}/api/materials?module_id=${selectedModuleId}`
      );
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  useEffect(() => {
    if (selectedModuleId) {
      fetchMaterials();
    }
  }, [selectedModuleId]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Kelola Modul & Materi</h2>
      {/* Modul */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Modul</h3>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setSelectedModuleEdit(null);
              setShowModuleModal(true);
            }}
          >
            + Tambah Modul
          </button>
        </div>
        <ul className="mt-4 border rounded divide-y">
          {modules.map((mod) => (
            <li
              key={mod.id}
              className={`p-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                selectedModuleId === mod.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedModuleId(mod.id)}
            >
              <span>{mod.title}</span>
              <div className="flex gap-2">
                <button
                  className="text-sm text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Hindari pemicu setSelectedModuleId
                    setSelectedModuleEdit(mod);
                    setShowModuleModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const confirmDelete = confirm(
                      "Yakin ingin menghapus modul?"
                    );
                    if (confirmDelete) {
                      await fetch(`${API_URL}/api/modules/${mod.id}`, {
                        method: "DELETE",
                      });
                      fetchModules(); // Refresh list modul
                      // Reset selected module jika yang dihapus adalah yang sedang aktif
                      if (selectedModuleId === mod.id) {
                        setSelectedModuleId(null);
                        setMaterials([]); // opsional, jika ingin clear materi
                      }
                    }
                  }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Materi */}
      {selectedModuleId && (
        <div className="bg-white shadow rounded p-4 relative">
          <h3 className="font-semibold mb-2">
            Materi untuk Modul:{" "}
            {modules.find((m) => m.id === selectedModuleId)?.title}
          </h3>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded mb-4"
            onClick={() => {
              setSelectedMaterial(null);
              setShowMaterialModal(true);
            }}
          >
            + Tambah Materi
          </button>

          <MaterialList
            moduleId={selectedModuleId}
            materials={materials}
            onEdit={(mat) => {
              setSelectedMaterial(mat);
              setShowMaterialModal(true);
            }}
            onDeleted={fetchMaterials}
          />
        </div>
      )}

      {selectedModuleId !== null && showMaterialModal && (
        <MaterialFormModal
          moduleId={selectedModuleId}
          selected={selectedMaterial}
          show={true}
          onClose={() => setShowMaterialModal(false)}
          onSaved={fetchMaterials}
        />
      )}
      <ModuleFormModal
        courseId={courseId}
        selected={selectedModuleEdit}
        onSaved={() => {
          fetchModules();
          setShowModuleModal(false);
        }}
        show={showModuleModal}
        onClose={() => setShowModuleModal(false)}
      />
    </div>
  );
};

export default CourseModuleMaterialPage;
