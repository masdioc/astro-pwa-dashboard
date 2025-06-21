import React, { useState } from "react";
import "../styles/global.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("http://103.187.146.112:3000/api/login", {
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
    <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen px-4">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">
        {/* Gambar */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/images/bg-login.png"
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">
            Login ke Aplikasi
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="user_input" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="user_input"
                name="user_input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="relative">
              <label htmlFor="secret_key" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="secret_key"
                name="secret_key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded pr-10 shadow-sm focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 text-sm text-gray-600 dark:text-gray-300"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Login
            </button>
            
          </form>
          <div className="text-center mt-4">
  <span className="text-sm text-gray-600 dark:text-gray-300">Belum punya akun?</span>
  <a
    href="/register"
    className="ml-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
  >
    Daftar di sini
  </a>
</div>

        </div>
      </div>
    </div>
  );
}
