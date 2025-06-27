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

const ModuleForm: React.FC<Props> = ({ courseId, onSaved, selected }) => {
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
  }, [selected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setForm({ title: "", order_index: 1, course_id: courseId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Nama Modul"
        className="border p-2 w-full"
      />
      <input
        type="number"
        name="order_index"
        value={form.order_index}
        onChange={handleChange}
        placeholder="Urutan"
        className="border p-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {selected ? "Update" : "Tambah"} Modul
      </button>
    </form>
  );
};

export default ModuleForm;
