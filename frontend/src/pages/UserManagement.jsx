import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getUsers, createUser, deleteUser, updateCredentials } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "cleaner" });
  const [editModal, setEditModal] = useState(null); // { id, name }
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [credLoading, setCredLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await createUser(form);
    setLoading(false);

    if (res.user) {
      toast.success("User created successfully");
      setForm({ name: "", username: "", password: "", role: "cleaner" });
      setShowForm(false);
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to create user");
    }
  };

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setCredLoading(true);
    const res = await updateCredentials(editModal.id, credentials);
    setCredLoading(false);
    if (res.message === "Credentials updated successfully") {
      toast.success(`Credentials updated for ${editModal.name}`);
      setEditModal(null);
      setCredentials({ username: "", password: "" });
      fetchUsers();
    } else {
      toast.error(res.message || "Failed to update credentials");
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const res = await deleteUser(id);
    if (res.message) {
      toast.success("User deleted");
      fetchUsers();
    } else {
      toast.error("Failed to delete user");
    }
  };

  const roleBadge = (role) =>
    role === "admin"
      ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700"
      : "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-blue-600 p-8 shadow-2xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">
                Admin Panel
              </p>
              <h1 className="text-4xl font-extrabold text-white">User Management</h1>
              <p className="mt-3 text-violet-100">
                Add, view, and remove admin and cleaner accounts.
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-2xl bg-white px-6 py-4 text-center font-bold text-violet-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-violet-50 hover:shadow-xl">
              {showForm ? "Cancel" : "+ Add User"}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-800">Create New User</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" name="name" placeholder="Enter full name"
                  value={form.name} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Username</label>
                <input type="text" name="username" placeholder="Enter username"
                  value={form.username} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" name="password" placeholder="Enter password"
                  value={form.password} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
                  <option value="cleaner">Cleaner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 md:col-span-2">
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-700 to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60">
                  {loading ? "Creating..." : "Create User"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-800">All Users</h2>
            <p className="text-sm text-slate-500">Total: {users.length} user{users.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Username</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id} className="transition-all duration-200 hover:bg-violet-50/50">
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {u.name}
                        {u._id === currentUser?.id && (
                          <span className="ml-2 text-xs text-slate-400">(you)</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">@{u.username}</td>
                      <td className="px-5 py-4">
                        <span className={roleBadge(u.role)}>{u.role}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString("en-CA", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditModal({ id: u._id, name: u.name }); setCredentials({ username: u.username, password: "" }); }}
                            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={u._id === currentUser?.id}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-100">
                    Edit Credentials
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-white">{editModal.name}</h2>
                </div>
                <button
                  onClick={() => setEditModal(null)}
                  className="rounded-full bg-white/20 px-3 py-1 text-xl font-bold text-white transition hover:bg-white/30">
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateCredentials} className="p-6 flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                  <span className="ml-1 text-xs font-normal text-slate-400">(leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 chars)"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  minLength={credentials.password ? 6 : undefined}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={credLoading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60">
                  {credLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal(null)}
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-100">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
