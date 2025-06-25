import React from "react";

import {
  BookOpen,
  ClipboardList,
  //   Mosque,
  ChartBar,
  Sun,
  Moon,
  HandHeart,
  Youtube,
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
  {
    title: "Metode Jariyah",
    icon: <Youtube className="w-8 h-8 text-pink-600" />,
    link: "/nonton_tv",
  },
  {
    title: "Report Observasi",
    icon: <ChartBar className="w-8 h-8 text-pink-600" />,
    link: "/observasi_report",
  },
];

const HomepageMenu: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        🕌 Menu Utama
      </h1> */}
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
