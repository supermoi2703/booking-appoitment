import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import homeImage from "../../general-images/home-page.jpg";
import doctorImage from "../../general-images/doctor-page.jpg";

const LandingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    const run = async () => {
      try {
        const [departmentData, doctorData] = await Promise.all([
          api.departmentsForList(),
          api.doctors(),
        ]);
        setDepartments(Array.isArray(departmentData) ? departmentData.slice(0, 6) : []);
        setDoctorCount(Array.isArray(doctorData) ? doctorData.length : 0);
      } catch {
        setDepartments([]);
      }
    };

    run();
  }, []);

  return (
    <section className="page">
      <div className="hero-grid">
        <div className="hero-card hero-home" style={{ backgroundImage: `url(${homeImage})` }}>
          <div className="hero-overlay">
            <p className="eyebrow">Hospital Microservice System</p>
            <h1>Book appointments and manage doctors in one place</h1>
            <p>
              Browse departments, find doctors, and schedule appointments through a
              single gateway-connected app.
            </p>
            <div className="row">
              <Link className="btn" to="/register-page">
                Create account
              </Link>
              <Link className="btn ghost" to="/doctor-page">
                Explore doctors
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-card hero-doctor" style={{ backgroundImage: `url(${doctorImage})` }}>
          <div className="hero-overlay compact">
            <h2>Find The Right Doctor</h2>
            <p>Search by department and open doctor profile to view available slots.</p>
            <Link className="btn" to="/doctor-page">
              View doctors
            </Link>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Quick Access</h2>
        <p>{doctorCount} doctors are currently available in the system.</p>
        <div className="grid">
          {departments.map((department) => (
            <article className="card" key={department.id}>
              <h3>{department.name}</h3>
              <p>{department.description || "Department overview"}</p>
              <Link to={`/department-page/${department.id}`}>Open department</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
