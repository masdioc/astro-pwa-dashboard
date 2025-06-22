import React, { useEffect, useState } from "react";
import "/src/styles/global.css";

import {
  Home,
  LayoutDashboard,
  Info,
  TestTubeDiagonal,
  Table,
  X,
  Menu,
  Moon,
  User,
  ChevronDown,
} from "lucide-react";

interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  // const [userName, setUserName] = useState("User");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
  const userStr = localStorage.getItem("user");
  console.log("User string:", userStr);
     if (!userStr) {
      // window.location.href = "/";
    } else {
      try {
        const user = JSON.parse(userStr);
        console.log(user);
        setUserName(user.name || "User");
      } catch (e) {
        console.error("Gagal parsing user:", e);
      }
    }

    const checkLoginTimeout = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const loginTime = parseInt(localStorage.getItem("loginTime") || "0");
      const timeoutMillis = 20 * 60 * 1000;
      const now = Date.now();
      if (isLoggedIn === "true" && now - loginTime > timeoutMillis) {
        alert("Sesi login Anda telah habis. Silakan login kembali.");
        localStorage.clear();
        window.location.href = "/";
      }
    };

    checkLoginTimeout();

    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main-content");
    const isHidden = sidebar?.classList.contains("-translate-x-full");
    sidebar?.classList.toggle("-translate-x-full");
    sidebar?.classList.toggle("translate-x-0");
    if (window.innerWidth >= 768 && sidebar && main) {
      main.classList.toggle("ml-60", isHidden);
      main.classList.toggle("ml-0", !isHidden);
    }
  };

  const toggleUserDropdown = () => {
    const dropdown = document.getElementById("userDropdown");
    dropdown?.classList.toggle("hidden");
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      html.classList.add("dark");
      localStorage.theme = "dark";
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className="w-60 transform -translate-x-full bg-blue-800 dark:bg-gray-900 text-white dark:text-gray-100 border-r-0 dark:border-r border-gray-700 h-screen fixed top-0 left-0 transition-transform duration-300 z-50"
        >
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Sidebar</h2>
            <button onClick={toggleSidebar} className="text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <nav className="mt-6 flex flex-col space-y-2 px-4">
            <a href="/home" className="hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
              <Home className="w-4 h-4 mr-2" /> Home
            </a>
            <a href="/dashboard" className="hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
            </a>
            <a href="/tentang" className="hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
              <Info className="w-4 h-4 mr-2" /> Tentang
            </a>
            <a href="/quiz" className="hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
              <TestTubeDiagonal className="w-4 h-4 mr-2" /> Quiz
            </a>
            <a href="/data" className="hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors px-2 py-1 rounded flex items-center">
              <Table className="w-4 h-4 mr-2" /> Data
            </a>
          </nav>
          <button
            onClick={logoutUser}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm shadow transition-all"
          >
            🚪 Logout
          </button>
        </aside>

        {/* Main Content */}
        <div id="main-content" className="ml-0 flex-1 flex flex-col min-h-screen transition-all duration-300">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
              >
                <Menu className="w-4 h-4" />
              </button>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded"
                title="Dark Mode"
              >
                <Moon className="w-4 h-4" />
              </button>
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm"
                >
                  <User className="w-4 h-4" /> <User className="w-4 h-4" /> {userName || "User"}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div
                  id="userDropdown"
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg hidden z-50"
                >
                  <ul className="text-sm text-gray-700 dark:text-gray-100">
                    <li>
                      <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Profil</a>
                    </li>
                    <li>
                      <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Pengaturan</a>
                    </li>
                    <li>
                      <hr className="my-1 border-gray-300 dark:border-gray-600" />
                    </li>
                    <li>
                      <a href="/" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600">Keluar</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 text-center text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 py-3">
        &copy; {new Date().getFullYear()} My App. All rights reserved.
      </footer>
    </div>
  );
}
