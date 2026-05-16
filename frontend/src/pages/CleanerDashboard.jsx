import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getBookings } from "../api/bookingApi";

const currency = import.meta.env.VITE_CURRENCY || "$";

const CleanerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [filters, setFilters] = useState({
    search: "", area: "", cleaningType: "", date: "",
  });

  const areas = [
    "NE Calgary", "SE Calgary", "NW Calgary", "SW Calgary",
    "Downtown", "Other area in Calgary",
  ];

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-CA", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "-";
    const [hours, minutes] = time.split(":");
    const d = new Date();
    d.setHours(hours);
    d.setMinutes(minutes);
    return d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const fetchBookings = async () => {
    const cleanFilters = {};
    Object.keys(filters).forEach((key) => { if (filters[key]) cleanFilters[key] = filters[key]; });
    const data = await getBookings(cleanFilters);
    setBookings(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = (e) => { e.preventDefault(); fetchBookings(); };

  const resetFilters = () => {
    setFilters({ search: "", area: "", cleaningType: "", date: "" });
    setTimeout(() => { getBookings().then((d) => setBookings(Array.isArray(d) ? d : [])); }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 p-8 shadow-2xl">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">
              Cleaner Dashboard
            </p>
            <h1 className="text-4xl font-extrabold text-white">My Bookings</h1>
            <p className="mt-3 max-w-2xl text-emerald-100">
              View all upcoming cleaning service bookings assigned to you.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch}
          className="mb-8 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-800">Filter Records</h2>
            <p className="text-sm text-slate-500">Search by name, service, area, or date.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <input type="text" name="search" placeholder="Search name"
              value={filters.search} onChange={handleFilterChange} className={inputClass} />
            <input type="text" name="cleaningType" placeholder="Cleaning type"
              value={filters.cleaningType} onChange={handleFilterChange} className={inputClass} />
            <select name="area" value={filters.area} onChange={handleFilterChange} className={inputClass}>
              <option value="">All Areas</option>
              {areas.map((area) => <option key={area} value={area}>{area}</option>)}
            </select>
            <input type="date" name="date" value={filters.date}
              onChange={handleFilterChange} className={inputClass} />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
              Apply Filters
            </button>
            <button type="button" onClick={resetFilters}
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100">
              Reset Filters
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Bookings</h2>
              <p className="text-sm text-slate-500">Total records: {bookings.length}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Cleaning</th>
                  <th className="px-5 py-4">Area</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="transition-all duration-200 hover:bg-emerald-50/70">
                      <td className="px-5 py-4 font-bold text-slate-800">{booking.fullName}</td>
                      <td className="px-5 py-4 text-slate-600">{booking.cleaningType}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
                          {booking.area}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(booking.date)}</td>
                      <td className="px-5 py-4 text-slate-600">{formatTime(booking.time)}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                          {currency}{booking.price?.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedBooking(booking)}
                          className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 text-3xl">
                          📋
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">No bookings found</h3>
                        <p className="mt-2 text-slate-500">Try changing the filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-emerald-600 to-cyan-500 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                      Booking Details
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold text-white">
                      {selectedBooking.fullName}
                    </h2>
                  </div>
                  <button onClick={() => setSelectedBooking(null)}
                    className="rounded-full bg-white/20 px-3 py-1 text-xl font-bold text-white transition hover:bg-white/30">
                    ×
                  </button>
                </div>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Detail label="Full Name" value={selectedBooking.fullName} />
                  <Detail label="Email" value={selectedBooking.email} />
                  <Detail label="Phone" value={selectedBooking.phone} />
                  <Detail label="Cleaning Type" value={selectedBooking.cleaningType} />
                  <Detail label="Area" value={selectedBooking.area} />
                  <Detail label="Price" value={`${currency}${selectedBooking.price || 0}`} />
                  <Detail label="Date" value={formatDate(selectedBooking.date)} />
                  <Detail label="Time" value={formatTime(selectedBooking.time)} />
                  <div className="md:col-span-2">
                    <Detail label="Full Address" value={selectedBooking.fullAddress} />
                  </div>
                  <div className="md:col-span-2">
                    <Detail label="Focus Details" value={selectedBooking.focusDetails || "-"} />
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={() => setSelectedBooking(null)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-100">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="break-words text-sm font-semibold text-slate-800">{value || "-"}</p>
  </div>
);

export default CleanerDashboard;
