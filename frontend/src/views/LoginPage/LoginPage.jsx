import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { STORAGE_KEYS } from "../../config";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      localStorage.setItem(STORAGE_KEYS.token, data.jwttoken || "");
      localStorage.setItem(STORAGE_KEYS.email, data.email || form.email);
      localStorage.setItem(STORAGE_KEYS.role, data.role || "[user]");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <form className="panel form" onSubmit={onSubmit}>
        <h2>Login</h2>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
};

export default LoginPage;
