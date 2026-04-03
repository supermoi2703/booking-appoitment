import { API_BASE_URL } from "../../config";

const emptyDoctor = {
  id: null,
  name: "",
  surname: "",
  specialty: "",
  email: "",
  departmentId: "",
};

const DoctorAdmin = ({
  doctors,
  departments,
  doctorForm,
  setDoctorForm,
  onSaveDoctor,
  onDeleteDoctor,
  onUploadDoctorImage,
}) => {
  const imageUrl = (imgName) => `${API_BASE_URL}/hospital/downloadFile/${imgName}`;

  return (
    <>
      <form className="panel form" onSubmit={onSaveDoctor}>
        <h3>{doctorForm.id ? "Edit Doctor" : "New Doctor"}</h3>
        <label htmlFor="doc-name">Name</label>
        <input
          id="doc-name"
          value={doctorForm.name}
          onChange={(event) =>
            setDoctorForm((prev) => ({ ...prev, name: event.target.value }))
          }
          required
        />
        <label htmlFor="doc-surname">Surname</label>
        <input
          id="doc-surname"
          value={doctorForm.surname}
          onChange={(event) =>
            setDoctorForm((prev) => ({ ...prev, surname: event.target.value }))
          }
          required
        />
        <label htmlFor="doc-specialty">Specialty</label>
        <input
          id="doc-specialty"
          value={doctorForm.specialty}
          onChange={(event) =>
            setDoctorForm((prev) => ({ ...prev, specialty: event.target.value }))
          }
          required
        />
        <label htmlFor="doc-email">Email</label>
        <input
          id="doc-email"
          type="email"
          value={doctorForm.email}
          onChange={(event) =>
            setDoctorForm((prev) => ({ ...prev, email: event.target.value }))
          }
          required
        />
        <label htmlFor="doc-department">Department</label>
        <select
          id="doc-department"
          value={doctorForm.departmentId}
          onChange={(event) =>
            setDoctorForm((prev) => ({ ...prev, departmentId: event.target.value }))
          }
          required
        >
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
        <div className="row" style={{ marginTop: "0.8rem" }}>
          <button className="btn" type="submit">
            Save
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => setDoctorForm(emptyDoctor)}
          >
            Clear
          </button>
        </div>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>
                  {doctor.name} {doctor.surname}
                </td>
                <td>{doctor.department?.name || "N/A"}</td>
                <td>{doctor.email}</td>
                <td>
                  {doctor.img ? (
                    <img
                      src={imageUrl(doctor.img)}
                      alt={`${doctor.name || "Doctor"}`}
                      style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  ) : (
                    <small>No image</small>
                  )}
                  <div className="row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        if (event.target.files?.[0]) {
                          onUploadDoctorImage(doctor.id, event.target.files[0]);
                          event.target.value = "";
                        }
                      }}
                    />
                  </div>
                </td>
                <td className="row">
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() =>
                      setDoctorForm({
                        id: doctor.id,
                        name: doctor.name || "",
                        surname: doctor.surname || "",
                        specialty: doctor.specialty || "",
                        email: doctor.email || "",
                        departmentId: doctor.department?.id || "",
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => onDeleteDoctor(doctor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DoctorAdmin;