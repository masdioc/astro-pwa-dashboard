import React, { useState, useEffect } from "react";
import { API_URL } from "astro:env/client";

interface Module {
  id?: number;
  title: string;
  order_index: number;
  course_id: number;
}

interface Props {
  courseId: number;
  show: boolean;
  onClose: () => void;
  onSaved: () => void;
  selected?: Module | null;
}

const ModuleFormModal: React.FC<Props> = ({
  courseId,
  show,
  onClose,
  onSaved,
  selected,
}) => {
  const [form, setForm] = useState<Module>({
    title: "",
    order_index: 1,
    course_id: courseId,
  });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({ title: "", order_index: 1, course_id: courseId });
    }
  }, [selected, courseId, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "order_index" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = selected ? "PUT" : "POST";
    const url = selected
      ? `${API_URL}/api/modules/${selected.id}`
      : `${API_URL}/api/modules`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSaved();
      onClose();
    } else {
      console.error("Gagal menyimpan modul");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">
          {selected ? "Edit Modul" : "Tambah Modul"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Nama Modul"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            name="order_index"
            value={form.order_index}
            onChange={handleChange}
            placeholder="Urutan"
            className="border p-2 w-full"
            required
          />
          <div className="flex justify-end gap-2 mt-4">
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

export default ModuleFormModal;
