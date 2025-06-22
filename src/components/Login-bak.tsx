import React, { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Proses login (misalnya fetch ke API)
    console.log({ username, password });
  };

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-x-hidden px-4">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">

        {/* Gambar di atas */}
        <img
          src="/images/dewasa-belajar.png"
          alt="Belajar"
          className="w-full max-w-[160px] mx-auto rounded-full mb-6 shadow"
        />

        {/* Judul */}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
          Masuk Belajar Asik
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-[38px] text-lg text-gray-500 dark:text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow transition-colors"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
