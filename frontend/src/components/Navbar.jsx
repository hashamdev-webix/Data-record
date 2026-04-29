import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Cleaning App
      </Link>

      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-600"
          }
        >
          Records
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-600 hover:text-blue-600"
          }
        >
          Add Booking
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;