import { useEffect, useState } from "react";
import { api } from "../../api/client";

const WORK_HOURS = [
  "NINE",
  "TEN",
  "ELEVEN",
  "TWELVE",
  "FOURTEEN",
  "FIFTEEN",
  "SIXTEEN",
  "SEVENTEEN",
  "EIGHTEEN",
];

const APPOINTMENT_MINUTES = ["ZERO", "TEN", "TWENTY", "THIRTY", "FOURTY", "FIVETY"];

const AppointmentPage = () => {
  const [doctorId, setDoctorId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [appointmentDay, setAppointmentDay] = useState("");
  const [workHour, setWorkHour] = useState("NINE");
  const [appointmentMinute, setAppointmentMinute] = useState("ZERO");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const deptData = await api.departmentsForList();
        setDepartments(Array.isArray(deptData) ? deptData : []);
      } catch (err) {
        setError(err.message);
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (!departmentId) {
      setDoctorList([]);
      setDoctorId("");
      return;
    }

    const run = async () => {
      try {
        const doctorData = await api.doctorsByDepartment(departmentId);
        setDoctorList(Array.isArray(doctorData) ? doctorData : []);
      } catch (err) {
        setError(err.message);
      }
    };
    run();
  }, [departmentId]);

  const load = async () => {
    if (!doctorId) {
      setError("Please enter doctor id.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const data = await api.appointmentsByDoctor(doctorId);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAppointments([]);
  }, [doctorId]);

  const save = async () => {
    if (!doctorId || !appointmentDay) {
      setError("Please select doctor and date.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      await api.saveAppointment({
        appointmentDay,
        workHour,
        appointmentMinute,
        doctorId: Number(doctorId),
      });
      setSuccess("Appointment created successfully.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel">
        <h2>Appointment Booking</h2>
        <p>Select department, doctor, date and time to create a new appointment.</p>
        <div className="row">
          <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
          <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)}>
            <option value="">Select doctor</option>
            {doctorList.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} {doctor.surname}
              </option>
            ))}
          </select>
          <input type="date" value={appointmentDay} onChange={(event) => setAppointmentDay(event.target.value)} />
          <select value={workHour} onChange={(event) => setWorkHour(event.target.value)}>
            {WORK_HOURS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select value={appointmentMinute} onChange={(event) => setAppointmentMinute(event.target.value)}>
            {APPOINTMENT_MINUTES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button type="button" className="btn ghost" onClick={save}>Save</button>
          <button type="button" className="btn" onClick={load}>
            Load doctor schedule
          </button>
        </div>
        {loading ? <p>Loading appointments...</p> : null}
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}
        <div className="grid">
          {appointments.map((item) => (
            <article className="card" key={item.id || `${item.appointmentDay}-${item.workHour}`}> 
              <h3>{item.appointmentDay || item.date || "Appointment"}</h3>
              <p>{item.workHour || item.hour ? `${item.workHour || item.hour}:${item.appointmentMinute || item.minute || "00"}` : "Time TBD"}</p>
              <small>Status: {item.status || "planned"}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppointmentPage;
