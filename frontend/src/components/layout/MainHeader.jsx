import { Link, NavLink, useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../config";

const MainHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const role = localStorage.getItem(STORAGE_KEYS.role);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.email);
    localStorage.removeItem(STORAGE_KEYS.role);
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="brand">
        <Link to="/">Hospital Care</Link>
      </div>
      <nav>
        <NavLink to="/doctor-page">Doctors</NavLink>
        <NavLink to="/department-page">Departments</NavLink>
        <NavLink to="/appointment-page">Appointments</NavLink>
        <NavLink to="/profile-page">Profile</NavLink>
        {token && role?.includes("admin") ? (
          <NavLink to="/dashboard/department">Dashboard</NavLink>
        ) : null}
      </nav>
      <div className="auth-actions">
        {token ? (
          <button type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login-page">Login</Link>
            <Link to="/register-page">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default MainHeader;
