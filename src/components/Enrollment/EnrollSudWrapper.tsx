import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EnrolledStudentList from "./EnrolledStudentList";
import ObservasiMur from "../Observasi/ObservasiMurid";

export default function EnrollStudWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EnrolledStudentList />} />
        <Route path="/enroll_student" element={<EnrolledStudentList />} />
        <Route path="/observasi_murid/:userId" element={<ObservasiMur />} />
      </Routes>
    </BrowserRouter>
  );
}
