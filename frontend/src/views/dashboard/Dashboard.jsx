import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { api } from "../../api/client";
import { STORAGE_KEYS } from "../../config";
import DepartmentAdmin from "./DepartmentAdmin";
import DoctorAdmin from "./DoctorAdmin";
import UserAdmin from "./UserAdmin";

const emptyDepartment = { id: null, name: "", description: "" };
const emptyDoctor = {
  id: null,
  name: "",
  surname: "",
  specialty: "",
  email: "",
  departmentId: "",
};

const Dashboard = () => {
  const email = localStorage.getItem(STORAGE_KEYS.email);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [users, setUsers] = useState([]);
  const [departmentForm, setDepartmentForm] = useState(emptyDepartment);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [assignUserId, setAssignUserId] = useState("");
  const [assignDoctorId, setAssignDoctorId] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  };

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    []
  );

  const refresh = async () => {
    try {
      const [departmentData, doctorData, userData] = await Promise.all([
        api.departments(),
        api.doctors(),
        api.allPersons(),
      ]);
      setDepartments(Array.isArray(departmentData) ? departmentData : []);
      setDoctors(Array.isArray(doctorData) ? doctorData : []);
      setUsers(
        Array.isArray(userData)
          ? userData.map((row) => {
              const person = row?.person || row || {};
              const doctor = row?.doctor || null;
              return {
                ...person,
                doctor,
                doctorId: person?.doctorId ?? doctor?.id ?? null,
              };
            })
          : []
      );
    } catch (err) {
      showToast("error", err.message);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const doctorById = useMemo(() => {
    const dict = {};
    doctors.forEach((doctor) => {
      dict[String(doctor.id)] = doctor;
    });
    return dict;
  }, [doctors]);

  const onSaveDepartment = async (event) => {
    event.preventDefault();
    try {
      await api.saveDepartment({
        id: departmentForm.id || undefined,
        name: departmentForm.name,
        description: departmentForm.description,
      });
      showToast("success", "Department saved.");
      setDepartmentForm(emptyDepartment);
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onSaveDoctor = async (event) => {
    event.preventDefault();
    try {
      await api.saveDoctor({
        id: doctorForm.id || undefined,
        name: doctorForm.name,
        surname: doctorForm.surname,
        specialty: doctorForm.specialty,
        email: doctorForm.email,
        department: { id: Number(doctorForm.departmentId) },
      });
      showToast("success", "Doctor saved.");
      setDoctorForm(emptyDoctor);
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onAssign = async (event) => {
    event.preventDefault();
    try {
      await api.setUserAsDoctor({ userId: Number(assignUserId), doctorId: Number(assignDoctorId) });
      showToast("success", "User assigned as doctor.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onDeleteDepartment = async (departmentId) => {
    try {
      await api.deleteDepartment(departmentId);
      showToast("success", "Department deleted.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onDeleteDoctor = async (doctorId) => {
    try {
      await api.deleteDoctor(doctorId);
      showToast("success", "Doctor deleted.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onDeletePerson = async (personId) => {
    try {
      await api.deletePerson(personId);
      showToast("success", "User deleted.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onUploadDoctorImage = async (doctorId, file) => {
    try {
      await api.uploadDoctorImage(doctorId, file);
      showToast("success", "Doctor image uploaded.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const onUploadDepartmentImage = async (departmentId, file) => {
    try {
      await api.uploadDepartmentImage(departmentId, file);
      showToast("success", "Department image uploaded.");
      await refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {email || "admin"}.</p>
        <div className="dash-tabs" style={{ marginBottom: "1rem" }}>
          <NavLink to="/dashboard/department" className={({ isActive }) => `dash-tab ${isActive ? "active" : ""}`}>
            Departments
          </NavLink>
          <NavLink to="/dashboard/doctor" className={({ isActive }) => `dash-tab ${isActive ? "active" : ""}`}>
            Doctors
          </NavLink>
          <NavLink to="/dashboard/user" className={({ isActive }) => `dash-tab ${isActive ? "active" : ""}`}>
            Users
          </NavLink>
        </div>
        {toast ? <div className={`toast ${toast.type}`}>{toast.message}</div> : null}

        <Routes>
          <Route index element={<Navigate to="department" replace />} />
          <Route
            path="department"
            element={
              <DepartmentAdmin
                departments={departments}
                departmentForm={departmentForm}
                setDepartmentForm={setDepartmentForm}
                onSaveDepartment={onSaveDepartment}
                onDeleteDepartment={onDeleteDepartment}
                onUploadDepartmentImage={onUploadDepartmentImage}
              />
            }
          />
          <Route
            path="doctor"
            element={
              <DoctorAdmin
                doctors={doctors}
                departments={departments}
                doctorForm={doctorForm}
                setDoctorForm={setDoctorForm}
                onSaveDoctor={onSaveDoctor}
                onDeleteDoctor={onDeleteDoctor}
                onUploadDoctorImage={onUploadDoctorImage}
              />
            }
          />
          <Route
            path="user"
            element={
              <UserAdmin
                users={users}
                doctors={doctors}
                doctorById={doctorById}
                assignUserId={assignUserId}
                setAssignUserId={setAssignUserId}
                assignDoctorId={assignDoctorId}
                setAssignDoctorId={setAssignDoctorId}
                onAssign={onAssign}
                onDeletePerson={onDeletePerson}
              />
            }
          />
        </Routes>
      </div>
    </section>
  );
};

export default Dashboard;
