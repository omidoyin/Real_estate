import { Routes, Route } from "react-router-dom";
import AdminLogin from "../components/Admin/AdminLogin";
import Dashboard from "../components/Admin/Dashboard";
import ManageAnnouncements from "../components/Admin/ManageAnnouncements";
import ManageInspections from "../components/Admin/ManageInspections";
import ManageLands from "../components/Admin/ManageLands";
import ManagePayments from "../components/Admin/ManagePayments";
import ManageTeams from "../components/Admin/ManageTeams";
import ManageUsers from "../components/Admin/ManageUsers";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-announcements" element={<ManageAnnouncements />} />
      <Route path="/manage-inspections" element={<ManageInspections />} />
      <Route path="/manage-lands" element={<ManageLands />} />
      <Route path="/manage-payments" element={<ManagePayments />} />
      <Route path="/manage-teams" element={<ManageTeams />} />
      <Route path="/manage-users" element={<ManageUsers />} />
    </Routes>
  );
}

export default AdminRoutes;
