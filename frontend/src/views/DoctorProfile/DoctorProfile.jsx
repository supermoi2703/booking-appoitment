import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const [doctorData, appointmentData] = await Promise.all([
          api.doctorProfile(doctorId),
          api.appointmentsByDoctor(doctorId),
        ]);
        setDoctor(doctorData);
        setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
      } catch (err) {
        setError(err.message);
      }
    };
    run();
  }, [doctorId]);

  return (
    <section className="page">
      <div className="panel">
        <h2>Doctor Profile</h2>
        {error ? <p className="error">{error}</p> : null}
        {doctor ? (
          <>
            <p><strong>Name:</strong> {doctor.name} {doctor.surname}</p>
            <p><strong>Department:</strong> {doctor.department?.name || doctor.departmentName || "N/A"}</p>
            <p><strong>Specialty:</strong> {doctor.specialty || "N/A"}</p>
            <p><strong>Email:</strong> {doctor.email || "N/A"}</p>
            <div className="row" style={{ marginBottom: "0.8rem" }}>
              <Link className="btn" to="/appointment-page">Book appointment</Link>
              <Link className="btn ghost" to="/doctor-page">Back to doctors</Link>
            </div>
            <h3>Reserved time slots</h3>
            <div className="grid">
              {appointments.map((item) => (
                <article className="card" key={item.id || `${item.appointmentDay}-${item.workHour}-${item.appointmentMinute}`}>
                  <p><strong>Date:</strong> {item.appointmentDay || item.date || "N/A"}</p>
                  <p><strong>Time:</strong> {item.workHour || item.hour || "--"}:{item.appointmentMinute || item.minute || "--"}</p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </section>
  );
};

export default DoctorProfile;
