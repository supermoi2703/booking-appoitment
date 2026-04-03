const UserAdmin = ({
  users,
  doctors,
  doctorById,
  assignUserId,
  setAssignUserId,
  assignDoctorId,
  setAssignDoctorId,
  onAssign,
  onDeletePerson,
}) => {
  return (
    <>
      <form className="panel form" onSubmit={onAssign}>
        <h3>Assign User As Doctor</h3>
        <label htmlFor="assign-user">User</label>
        <select
          id="assign-user"
          value={assignUserId}
          onChange={(event) => setAssignUserId(event.target.value)}
          required
        >
          <option value="">Select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {(user.name || "-")} {(user.surname || "")} ({user.email || "no-email"})
            </option>
          ))}
        </select>

        <label htmlFor="assign-doctor">Doctor</label>
        <select
          id="assign-doctor"
          value={assignDoctorId}
          onChange={(event) => setAssignDoctorId(event.target.value)}
          required
        >
          <option value="">Select doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} {doctor.surname}
            </option>
          ))}
        </select>

        <button className="btn" type="submit" style={{ marginTop: "0.8rem" }}>
          Assign
        </button>
      </form>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Doctor Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {(user.name || "-")} {(user.surname || "")}
                </td>
                <td>{user.email || "-"}</td>
                <td>{user.role || "-"}</td>
                <td>{user.doctorId || "-"}</td>
                <td className="row">
                  <button
                    className="btn ghost"
                    type="button"
                    onClick={() => onDeletePerson(user.id)}
                  >
                    Delete
                  </button>
                  {user.doctorId ? (
                    <small>{doctorById[String(user.doctorId)]?.name || "assigned"}</small>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserAdmin;