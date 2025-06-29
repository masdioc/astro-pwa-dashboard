import React, { useState } from "react";
import CourseModuleMaterialPage from "./CourseModuleMaterialPage"; // pastikan nama file tepat!

const CourseManagerPage: React.FC = () => {
  const [showModuleManager, setShowModuleManager] = useState(false);

  return (
    <div className="p-4">
      <div className="mt-6">
        <CourseModuleMaterialPage courseId={3} />
      </div>
    </div>
  );
};

export default CourseManagerPage;
