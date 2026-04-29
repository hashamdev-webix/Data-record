import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleBooking, updateBooking } from "../api/bookingApi";

const EditBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    cleaningType: "",
    area: "",
    focusDetails: "",
    date: "",
    time: "",
    fullAddress: "",
    price: "",
    email: "",
phone: "",
  });

  const areas = [
    "NE Calgary",
    "SE Calgary",
    "NW Calgary",
    "SW Calgary",
    "Downtown",
    "Other area in Calgary",
  ];

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  useEffect(() => {
    const fetchSingleBooking = async () => {
      const data = await getSingleBooking(id);

      setForm({
        fullName: data.fullName || "",
        cleaningType: data.cleaningType || "",
        area: data.area || "",
        focusDetails: data.focusDetails || "",
        date: data.date || "",
        time: data.time || "",
        fullAddress: data.fullAddress || "",
        price: data.price || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    };

    fetchSingleBooking();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...form,
      price: Number(form.price),
    };

    const res = await updateBooking(id, data);

    if (res.booking) {
      toast.success("Booking updated successfully");
      navigate("/");
    } else {
      toast.error(res.message || "Failed to update booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-500 p-8 shadow-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
            Update Customer Record
          </p>

          <h1 className="text-4xl font-extrabold text-white">
            Edit Booking
          </h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Modify customer service details, address, date, time, and price.
          </p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter customer full name"
                value={form.fullName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Cleaning Type</label>
              <input
                type="text"
                name="cleaningType"
                placeholder="Deep cleaning, move-out cleaning..."
                value={form.cleaningType}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Calgary Area</label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Calgary Area</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Price</label>
              <input
                type="number"
                name="price"
                placeholder="Enter service price"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Service Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Service Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Full Address</label>
              <input
                type="text"
                name="fullAddress"
                placeholder="Enter complete customer address"
                value={form.fullAddress}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Focus Details</label>
              <textarea
                name="focusDetails"
                placeholder="Anything specific customer wants us to focus on?"
                value={form.focusDetails}
                onChange={handleChange}
                className={`${inputClass} h-32 resize-none`}
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 md:col-span-2 md:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40"
              >
                Update Booking
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;