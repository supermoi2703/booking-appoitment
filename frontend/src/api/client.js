import { API_BASE_URL, STORAGE_KEYS } from "../config";

const buildUrl = (path) => `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

const request = async (path, options = {}) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const headers = { ...(options.headers || {}) };
  const isFormData = options.body instanceof FormData;

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
};

export const api = {
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  departments: () => request("/hospital/department/findAll"),

  doctors: () => request("/hospital/doctor/findAll"),

  doctorProfile: (doctorId) => request(`/hospital/doctor/findById/${doctorId}`),

  appointmentsByDoctor: (doctorId) =>
    request(`/appointment/getAppointmentByDoctor/${doctorId}`),

  doctorsByDepartment: (departmentId) =>
    request(`/hospital/doctor/findAllByDepartment/${departmentId}`),

  departmentById: (departmentId) =>
    request(`/hospital/department/findById/${departmentId}`),

  departmentsForList: () => request("/hospital/department/findAllForList"),

  saveDepartment: (payload) =>
    request("/hospital/department/save", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteDepartment: (departmentId) =>
    request(`/hospital/department/delete/${departmentId}`, {
      method: "DELETE",
    }),

  saveDoctor: (payload) =>
    request("/hospital/doctor/save", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteDoctor: (doctorId) =>
    request(`/hospital/doctor/delete/${doctorId}`, {
      method: "DELETE",
    }),

  allPersons: () => request("/auth/findAllPerson"),

  deletePerson: (personId) =>
    request(`/auth/deleteById/${personId}`, {
      method: "DELETE",
    }),

  setUserAsDoctor: ({ userId, doctorId }) =>
    request(`/auth/setAsDoctor/${userId}/${doctorId}`, {
      method: "POST",
    }),

  userWithAppointments: () => request("/auth/getUserWithAppointment"),

  appointmentsByUser: (userId) => request(`/appointment/getAppointmentByUser/${userId}`),

  deleteAppointment: (appointmentId) =>
    request(`/appointment/delete/${appointmentId}`, {
      method: "DELETE",
    }),

  saveAppointment: (payload) =>
    request("/appointment/save", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  weeklyAppointmentsForDoctor: (doctorId) =>
    request(`/appointment/getWeekAppointmentWithUserByDoctor/${doctorId}`),

  analysisForPerson: (personId) => request(`/analysis/getAnalysisForPerson/${personId}`),

  uploadDoctorImage: (doctorId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/hospital/uploadDoctorImage/${doctorId}`, {
      method: "POST",
      body: formData,
    });
  },

  uploadDepartmentImage: (departmentId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request(`/hospital/uploadDepartmentImage/${departmentId}`, {
      method: "POST",
      body: formData,
    });
  },
};
