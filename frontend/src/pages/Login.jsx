import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await loginUser(form.username, form.password);
    setLoading(false);

    if (res.token) {
      login(res.user, res.token);
      toast.success(`Welcome, ${res.user.name}!`);
      navigate(res.user.role === "admin" ? "/admin" : "/cleaner");
    } else {
      toast.error(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-extrabold text-white">Cleaning App</h1>
          <p className="mt-2 text-blue-100 text-sm">Sign in to your dashboard</p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                className={inputClass}
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
