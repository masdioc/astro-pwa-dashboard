import React, { useState } from "react";
import CourseModuleMaterialPage from "./CourseModuleMaterialPage"; // pastikan nama file tepat!

const CourseManagerPage: React.FC = () => {
  const [showModuleManager, setShowModuleManager] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kelola Course</h1>

      <button
        onClick={() => {
          console.log("Tombol diklik");
          setShowModuleManager((prev) => !prev);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow relative z-10"
      >
        {showModuleManager ? "Tutup Modul & Materi" : "Kelola Modul & Materi"}
      </button>

      {showModuleManager && (
        <div className="mt-6">
          <CourseModuleMaterialPage courseId={3} />
        </div>
      )}
    </div>
  );
};

export default CourseManagerPage;
