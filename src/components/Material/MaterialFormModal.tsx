import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";

interface Material {
  id?: number;
  title: string;
  content: string;
  module_id: number;
}

interface Props {
  moduleId: number;
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  selected?: Material | null;
}

const MaterialFormModal: React.FC<Props> = ({
  moduleId,
  show,
  onClose,
  onSaved,
  selected,
}) => {
  const [form, setForm] = useState<Material>({
    title: "",
    content: "",
    module_id: moduleId,
  });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({ title: "", content: "", module_id: moduleId });
    }
  }, [selected, moduleId, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = selected ? "PUT" : "POST";
    const url = selected
      ? `${API_URL}/api/materials/${selected.id}`
      : `${API_URL}/api/materials`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSaved();
      onClose();
    } else {
      console.error("Gagal menyimpan materi");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-xl w-full">
        <h2 className="text-lg font-semibold mb-4">
          {selected ? "Edit Materi" : "Tambah Materi"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Judul Materi"
            className="border p-2 w-full"
            required
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Konten Materi"
            className="border p-2 w-full h-32"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {selected ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialFormModal;
