import React from "react";

import {
  BookOpen,
  ClipboardList,
  //   Mosque,
  Sun,
  Moon,
  HandHeart,
  //   HandsPraying,
} from "lucide-react";
import {
  //   BookOpen,
  //   ClipboardList,
  Landmark,
  //   Sun,
  //   HandsPraying,
} from "lucide-react";

const menus = [
  {
    title: "Latihan Soal",
    icon: <ClipboardList className="w-8 h-8 text-blue-600" />,
    link: "/quiz",
  },
  {
    title: "Baca Quran",
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    link: "/surahIndex",
  },
  {
    title: "Dengerin Juz Amma",
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    link: "/dengerin_juzamma",
  },
  {
    title: "Bank Soal",
    icon: <ClipboardList className="w-8 h-8 text-orange-500" />,
    link: "/soal",
  },
  {
    title: "Dzikir Harian",
    icon: <Landmark className="w-8 h-8 text-indigo-600" />,
    link: "/dzikir",
  },
  {
    title: "Dzikir Pagi Sore",
    icon: <Sun className="w-8 h-8 text-yellow-500" />,
    link: "/dzikir_pagi_sore",
  },
  {
    title: "Doa Setelah Salat Sunah",
    icon: <HandHeart className="w-8 h-8 text-pink-600" />,
    link: "/doa",
  },
];

const HomepageMenu: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        🕌 Menu Utama
      </h1> */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {menus.map((menu, index) => (
          <a
            href={menu.link}
            key={index}
            className="bg-white shadow-lg hover:shadow-xl transition duration-300 rounded-xl p-5 flex flex-col items-center text-center border border-gray-200"
          >
            <div className="mb-4">{menu.icon}</div>
            <span className="text-lg font-medium text-gray-700">
              {menu.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HomepageMenu;
