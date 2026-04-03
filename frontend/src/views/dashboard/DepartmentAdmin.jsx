import { API_BASE_URL } from "../../config";

const DepartmentAdmin = ({
  departments,
  departmentForm,
  setDepartmentForm,
  onSaveDepartment,
  onDeleteDepartment,
  onUploadDepartmentImage,
}) => {
  const imageUrl = (imgName) => `${API_BASE_URL}/hospital/downloadFile/${imgName}`;

  return (
    <>
      <form className="panel form" onSubmit={onSaveDepartment}>
        <h3>{departmentForm.id ? "Edit Department" : "New Department"}</h3>
        <label htmlFor="dep-name">Name</label>
        <input
          id="dep-name"
          value={departmentForm.name}
          onChange={(event) =>
            setDepartmentForm((prev) => ({ ...prev, name: event.target.value }))
          }
          required
        />
        <label htmlFor="dep-desc">Description</label>
        <input
          id="dep-desc"
          value={departmentForm.description}
          onChange={(event) =>
            setDepartmentForm((prev) => ({ ...prev, description: event.target.value }))
          }
          required
        />
        <div className="row" style={{ marginTop: "0.8rem" }}>
          <button className="btn" type="submit">
            Save
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => setDepartmentForm({ id: null, name: "", description: "" })}
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
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>{department.name}</td>
                <td>{department.description}</td>
                <td>
                  {department.img ? (
                    <img
                      src={imageUrl(department.img)}
                      alt={`${department.name || "Department"}`}
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
                          onUploadDepartmentImage(department.id, event.target.files[0]);
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
                    onClick={() => setDepartmentForm(department)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => onDeleteDepartment(department.id)}
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

export default DepartmentAdmin;