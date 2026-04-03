import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainHeader from "./components/layout/MainHeader";
import { STORAGE_KEYS } from "./config";
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import DoctorPage from "./views/DoctorPage/DoctorPage";
import DepartmentPage from "./views/DepartmentPage/DepartmentPage";
import AppointmentPage from "./views/AppointmentPage/AppointmentPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import DoctorProfile from "./views/DoctorProfile/DoctorProfile";
import Dashboard from "./views/dashboard/Dashboard";
import "./App.css";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  return token ? children : <Navigate to="/login-page" />;
};

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const role = localStorage.getItem(STORAGE_KEYS.role) || "";
  return token && role.includes("admin") ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <MainHeader />
      <main className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/register-page" element={<RegisterPage />} />
          <Route path="/doctor-page" element={<DoctorPage />} />
          <Route path="/department-page" element={<DepartmentPage />} />
          <Route path="/department-page/:departmentId" element={<DepartmentPage />} />
          <Route path="/doctor-profile/:doctorId" element={<DoctorProfile />} />
          <Route
            path="/appointment-page"
            element={
              <RequireAuth>
                <AppointmentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile-page"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <RequireAdmin>
                <Dashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
