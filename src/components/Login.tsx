import React, { useState } from "react";
import { API_URL } from "astro:env/client";
import "../styles/global.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("loginTime", Date.now().toString());
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/home";
    } catch (err) {
      alert("Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        
        {/* Gambar Bulat */}
        <img
          src="/images/dewasa-belajar.png" // Ganti dengan path gambar kamu
          alt="Logo"
          className="w-60 h-auto max-w-lg rounded-lg max-w-lg mx-auto"
          // className="w-24 h-24 rounded-full mx-auto mb-4 shadow"
        />

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4 mt-4">
          Masuk Belajar Asik
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="user_input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              id="user_input"
              name="user_input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <label htmlFor="secret_key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="secret_key"
              name="secret_key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-8 text-lg text-gray-500 dark:text-gray-300 hover:scale-110 transition-transform"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-md shadow-md"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-600 dark:text-gray-300">Belum punya akun?</span>
          <a
            href="/register"
            className="ml-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}
