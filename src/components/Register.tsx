import { useState } from "react";
import { API_URL } from "astro:env/client";
type RegisterData = {
  username: string;
  password: string;
  name: string;
  level: string;
  email: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    password: "",
    name: "",
    level: "user",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(API_URL+"/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Registrasi berhasil!");
        setFormData({
          username: "",
          password: "",
          name: "",
          level: "user",
          email: "",
        });
      } else {
        const error = await res.json();
        setMessage(`❌ Gagal: ${error.message || "Registrasi gagal."}`);
      }
    } catch (err) {
      setMessage("❌ Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Form Registrasi</h1>

        {message && (
          <div className="mb-4 p-3 text-sm text-white rounded bg-blue-500">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="TK">TK</option>
              <option value="SD">SD</option>
                 <option value="SMP">SMP</option>
                    <option value="SMA">SMA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>
             <div className="text-center mt-4">
  <span className="text-sm text-gray-600 dark:text-gray-300">Kembali</span>
  <a
    href="/"
    className="ml-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
  >
   Login
  </a>
</div>
      </div>
    </div>
  );
}
