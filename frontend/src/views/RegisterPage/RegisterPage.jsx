import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.register(form);
      setSuccess("Registered successfully. You can login now.");
      setTimeout(() => navigate("/login-page"), 800);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="page">
      <form className="panel form" onSubmit={onSubmit}>
        <h2>Register</h2>
        <label htmlFor="name">First name</label>
        <input id="name" name="name" value={form.name} onChange={onChange} required />
        <label htmlFor="surname">Last name</label>
        <input id="surname" name="surname" value={form.surname} onChange={onChange} required />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
        {error ? <p className="error">{error}</p> : null}
        {success ? <p className="success">{success}</p> : null}
        <button className="btn" type="submit">Create account</button>
      </form>
    </section>
  );
};

export default RegisterPage;
