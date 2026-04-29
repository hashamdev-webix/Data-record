const API_URL = `${import.meta.env.VITE_BASE_URL}/api/bookings`;

export const getBookings = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();

  const res = await fetch(`${API_URL}?${query}`);
  return res.json();
};

export const getSingleBooking = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

export const createBooking = async (data) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateBooking = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteBooking = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return res.json();
};