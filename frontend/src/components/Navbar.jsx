import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link
        to={user?.role === "admin" ? "/admin" : "/cleaner"}
        className="text-2xl font-bold text-blue-600"
      >
        Cleaning App
      </Link>

      <div className="flex items-center gap-4">
        {user?.role === "admin" && (
          <>
            <NavLink to="/admin" className={linkClass}>Records</NavLink>
            <NavLink to="/add" className={linkClass}>Add Booking</NavLink>
            <NavLink to="/users" className={linkClass}>Users</NavLink>
          </>
        )}

        {user?.role === "cleaner" && (
          <NavLink to="/cleaner" className={linkClass}>My Bookings</NavLink>
        )}

        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-100 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
