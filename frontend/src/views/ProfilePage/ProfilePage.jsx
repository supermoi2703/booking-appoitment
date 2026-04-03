import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { STORAGE_KEYS } from "../../config";

const ProfilePage = () => {
  const email = localStorage.getItem(STORAGE_KEYS.email) || "guest";
  const role = localStorage.getItem(STORAGE_KEYS.role) || "[user]";
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isDoctor = useMemo(() => role.includes("doctor"), [role]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.userWithAppointments();
      setProfile(data);

      if (data?.person?.id) {
        const analysisData = await api.analysisForPerson(data.person.id);
        setAnalysis(analysisData);
      }

      if (data?.person?.doctorId) {
        const weeklyData = await api.weeklyAppointmentsForDoctor(data.person.doctorId);
        setWeekly(Array.isArray(weeklyData) ? weeklyData : []);
      } else {
        setWeekly([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onDelete = async (appointmentId) => {
    try {
      await api.deleteAppointment(appointmentId);
      await loadProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <div className="panel">
        <h2>Profile</h2>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Role:</strong> {role}</p>
        {loading ? <p>Loading profile data...</p> : null}
        {error ? <p className="error">{error}</p> : null}

        {profile?.person ? (
          <div className="card" style={{ marginBottom: "0.8rem" }}>
            <h3>{profile.person.name} {profile.person.surname}</h3>
            <p>Doctor ID: {profile.person.doctorId || "Not assigned"}</p>
          </div>
        ) : null}

        <h3>My appointments</h3>
        <div className="grid">
          {(profile?.appointmentList || []).map((item) => (
            <article className="card" key={item.id || `${item.appointmentDay}-${item.workHour}`}>
              <p><strong>Date:</strong> {item.appointmentDay || item.date || "N/A"}</p>
              <p><strong>Time:</strong> {item.workHour || item.hour || "--"}:{item.appointmentMinute || item.minute || "--"}</p>
              <button className="btn ghost" type="button" onClick={() => onDelete(item.id)}>
                Cancel
              </button>
            </article>
          ))}
        </div>

        <h3>Analysis</h3>
        <div className="grid">
          <article className="card">
            <p><strong>Blood type:</strong> {analysis?.bloodType?.bloodType || "N/A"}</p>
            <p><strong>Kreatinin:</strong> {analysis?.kreatinin?.result || "N/A"}</p>
            <p><strong>Hemogram:</strong> {analysis?.hemogram?.result || "N/A"}</p>
          </article>
        </div>

        {isDoctor ? (
          <>
            <h3>Weekly doctor schedule</h3>
            <div className="grid">
              {weekly.map((item) => (
                <article className="card" key={item.id || `${item.appointmentDay}-${item.workHour}`}>
                  <p><strong>Patient:</strong> {item.personName || item.userName || "N/A"}</p>
                  <p><strong>Date:</strong> {item.appointmentDay || item.date || "N/A"}</p>
                  <p><strong>Time:</strong> {item.workHour || item.hour || "--"}:{item.appointmentMinute || item.minute || "--"}</p>
                </article>
              ))}
            </div>
          </>
        ) : null}

        <div className="row">
          <Link className="btn" to="/doctor-page">Find doctor</Link>
          <Link className="btn ghost" to="/appointment-page">Check appointments</Link>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
