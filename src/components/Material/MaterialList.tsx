// 📁 MaterialList.tsx
import React from "react";

interface Material {
  id: number;
  title: string;
  content: string;
  module_id: number;
}

interface Props {
  moduleId: number;
  materials: Material[];
  onEdit: (mat: Material) => void;
  onDeleted: () => void;
  selected?: Material | null; // ✅ Benar: Ini Material
}

const MaterialList: React.FC<Props> = ({
  moduleId,
  materials,
  onEdit,
  onDeleted,
}) => {
  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus materi ini?")) {
      await fetch(`/api/materials/${id}`, { method: "DELETE" });
      onDeleted();
    }
  };

  return (
    <table className="w-full mt-4">
      <thead>
        <tr>
          <th className="text-left">Judul</th>
          <th className="text-left">Konten</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((mat) => (
          <tr key={mat.id}>
            <td>{mat.title}</td>
            <td>{mat.content}</td>
            <td>
              <button
                onClick={() => onEdit(mat)}
                className="text-blue-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(mat.id)}
                className="text-red-600"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MaterialList;
