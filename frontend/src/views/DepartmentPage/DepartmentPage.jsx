import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/client";

const DepartmentPage = () => {
  const { departmentId } = useParams();
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [departmentDetail, setDepartmentDetail] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const tasks = [api.departments()];

        if (departmentId) {
          tasks.push(api.departmentById(departmentId));
          tasks.push(api.doctorsByDepartment(departmentId));
        } else {
          tasks.push(Promise.resolve(null));
          tasks.push(api.doctors());
        }

        const [deptData, detailData, doctorData] = await Promise.all(tasks);
        setDepartments(Array.isArray(deptData) ? deptData : []);
        setDoctors(Array.isArray(doctorData) ? doctorData : []);
        setDepartmentDetail(detailData);
      } catch (err) {
        setError(err.message);
      }
    };
    run();
  }, [departmentId]);

  const mapped = useMemo(
    () =>
      departments.map((dept) => {
        const deptDoctors = doctors.filter(
          (doctor) =>
            doctor.departmentId === dept.id ||
            doctor.department?.id === dept.id ||
            doctor.departmentName === dept.name,
        );
        return { dept, deptDoctors };
      }),
    [departments, doctors],
  );

  const currentDepartment = departmentDetail || departments.find((item) => String(item.id) === String(departmentId));

  return (
    <section className="page">
      <div className="panel">
        <h2>{departmentId ? "Department Detail" : "Departments"}</h2>
        {error ? <p className="error">{error}</p> : null}

        {departmentId && currentDepartment ? (
          <article className="card" style={{ marginBottom: "0.8rem" }}>
            <h3>{currentDepartment.name}</h3>
            <p>{currentDepartment.description || "Hospital department"}</p>
            <small>{doctors.length} doctors in this department</small>
          </article>
        ) : null}

        <div className="grid">
          {(departmentId
            ? mapped.filter(({ dept }) => String(dept.id) === String(departmentId))
            : mapped
          ).map(({ dept, deptDoctors }) => (
            <article className="card" key={dept.id}>
              <h3>{dept.name}</h3>
              <p>{dept.description || "Hospital department"}</p>
              <small>{deptDoctors.length} doctors</small>
              <div className="row" style={{ marginTop: "0.5rem" }}>
                <Link to={`/department-page/${dept.id}`}>Open</Link>
                <Link to="/doctor-page">View doctors</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentPage;
