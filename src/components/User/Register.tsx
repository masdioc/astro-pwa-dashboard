import { useState } from "react";
import { API_URL } from "astro:env/client";
import WilayahSelector from "../../components/Etc/WilayahSelector";

type RegisterData = {
  username: string;
  password: string;
  name: string;
  level: string;
  email: string;
  role: string;
  province_id: string;
  regence_id: string;
  district_id: string;
  village_id: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    password: "",
    name: "",
    level: "TK",
    email: "",
    role: "santri",
    province_id: "",
    regence_id: "",
    district_id: "",
    village_id: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Data dikirim ke backend:", formData);
      if (res.ok) {
        setMessage("✅ Registrasi berhasil!");
        setFormData({
          username: "",
          password: "",
          name: "",
          level: "TK",
          email: "",
          role: "santri",
          province_id: "",
          regence_id: "",
          district_id: "",
          village_id: "",
        });
        // window.location.href = "/home";
      } else {
        const error = await res.json();
        setMessage(`❌ Gagal: ${error.message || "Registrasi gagal."}`);
      }
    } catch {
      setMessage("❌ Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Form Registrasi
        </h1>

        {message && (
          <div className="mb-4 p-3 text-sm text-white rounded bg-blue-500">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nama Lengkap"
            className="w-full p-2 border rounded"
          />

          {/* WilayahSelector */}
          <WilayahSelector
            onChange={(wilayah) =>
              setFormData((prev) => ({
                ...prev,
                ...wilayah,
              }))
            }
          />

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="TK">TK</option>
            <option value="SD">SD</option>
            <option value="SMP">SMP</option>
            <option value="SMA">SMA</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="santri">Santri</option>
            <option value="guru">Guru</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Sudah punya akun?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
