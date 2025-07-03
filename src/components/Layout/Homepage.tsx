import React, { JSX, useEffect, useState } from "react";

import {
  BookOpen,
  ClipboardList,
  ChartBar,
  Sun,
  Moon,
  HandHeart,
  Youtube,
  FileInput,
  Landmark,
  Users,
  School,
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: JSX.Element;
  link: string;
  roles: string[]; // Tambah array role di sini
}

const allMenus: MenuItem[] = [
  // {
  //   title: "Latihan Soal",
  //   icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
  //   link: "/quiz",
  //   roles: ["santri", "guru"],
  // },
  // {
  //   title: "Baca Quran",
  //   icon: <BookOpen className="w-8 h-8 text-green-600" />,
  //   link: "/surahIndex",
  //   roles: ["santri", "guru", "admin"],
  // },
  // {
  //   title: "Dengerin Juz Amma",
  //   icon: <BookOpen className="w-8 h-8 text-green-600" />,
  //   link: "/dengerin_juzamma",
  //   roles: ["santri"],
  // },
  // {
  //   title: "Bank Soal",
  //   icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
  //   link: "/soal",
  //   roles: ["guru"],
  // },
  // {
  //   title: "Dzikir Harian",
  //   icon: <Landmark className="w-8 h-8 text-indigo-600" />,
  //   link: "/dzikir",
  //   roles: ["santri", "guru", "admin"],
  // },
  // {
  //   title: "Dzikir Pagi Sore",
  //   icon: <Sun className="w-8 h-8 text-yellow-500" />,
  //   link: "/dzikir_pagi_sore",
  //   roles: ["santri", "guru"],
  // },
  // {
  //   title: "Doa Setelah Salat Sunah",
  //   icon: <HandHeart className="w-8 h-8 text-pink-600" />,
  //   link: "/doa",
  //   roles: ["santri", "guru"],
  // },
  // {
  //   title: "Metode Jariyah",
  //   icon: <Youtube className="w-8 h-8 text-pink-600" />,
  //   link: "/nonton_tv",
  //   roles: ["santri", "guru", "admin"],
  // },
  {
    title: "Data Guru",
    icon: <Users className="w-8 h-8 text-pink-600" />,
    link: "/u/data_guru",
    roles: ["admin"],
  },
  {
    title: "Data Siswa",
    icon: <Users className="w-8 h-8 text-pink-600" />,
    link: "/u/data_siswa",
    roles: ["admin"],
  },
  {
    title: "Modul Pembelajaran",
    icon: <School className="w-8 h-8 text-pink-600" />,
    link: "/modules",
    roles: ["guru", "admin"],
  },
  {
    title: "Kelas",
    icon: <School className="w-8 h-8 text-pink-600" />,
    link: "/course",
    roles: ["guru"],
  },
  {
    title: "Daftar Santri",
    icon: <Users className="w-8 h-8 text-pink-600" />,
    link: "/enroll_student",
    roles: ["guru"],
  },

  {
    title: "Observasi Santri",
    icon: <ChartBar className="w-8 h-8 text-pink-600" />,
    link: "/observasi/observasi_murid",
    roles: ["guru"],
  },

  {
    title: "Enroll",
    icon: <FileInput className="w-8 h-8 text-pink-600" />,
    link: "/course_register",
    roles: ["santri"],
  },
  {
    title: "Modul Pembelajaran",
    icon: <BookOpen className="w-8 h-8 text-pink-600" />,
    link: "/modules_list",
    roles: ["santri"],
  },
  {
    title: "Observasi",
    icon: <ChartBar className="w-8 h-8 text-pink-600" />,
    link: "/observasi_report",
    roles: ["santri"],
  },
  {
    title: "Statistik Pembelajaran",
    icon: <ChartBar className="w-8 h-8 text-pink-600" />,
    link: "/course/course_chart",
    roles: ["santri"],
  },
  {
    title: "Monitor Pembelajaran Santri",
    icon: <ChartBar className="w-8 h-8 text-pink-600" />,
    link: "/course/course_monitor_siswa",
    roles: ["guru"],
  },
];

const HomepageMenu: React.FC = () => {
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setRole(user.role || "");
      } catch (error) {
        console.error("Gagal parse user dari localStorage", error);
      }
    }
  }, []);

  const menus = allMenus.filter((menu) => menu.roles.includes(role));

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {menus.map((menu, index) => (
            <a
              href={menu.link}
              key={index}
              className="bg-white shadow-md hover:shadow-lg transition duration-300 rounded-lg p-3 flex flex-col items-center text-center border border-gray-200"
            >
              <div className="mb-2">
                {React.cloneElement(menu.icon, {
                  className: menu.icon.props.className + " w-6 h-6",
                })}
              </div>
              <span className="text-sm font-medium text-gray-700 leading-tight">
                {menu.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageMenu;
