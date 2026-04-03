import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import doctorImage from "../../general-images/doctor-page.jpg";

const DoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        setDoctors(await api.doctors());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <section className="page">
      <div className="hero-card hero-doctor" style={{ backgroundImage: `url(${doctorImage})` }}>
        <div className="hero-overlay compact">
          <p className="eyebrow">Specialist Search</p>
          <h2>Doctors by Hospital Services</h2>
          <p>Pick a doctor and open profile to check reserved schedules.</p>
        </div>
      </div>
      <div className="panel">
        <h2>Doctors</h2>
        {loading ? <p>Loading doctors...</p> : null}
        {error ? <p className="error">{error}</p> : null}
        <div className="grid">
          {doctors.map((doctor) => (
            <article className="card" key={doctor.id || doctor.doctorId}>
              <h3>{doctor.name} {doctor.surname}</h3>
              <p>{doctor.title || "Doctor"}</p>
              <Link to={`/doctor-profile/${doctor.id || doctor.doctorId}`}>View profile</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorPage;
