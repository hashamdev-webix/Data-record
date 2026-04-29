import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Bookings from './pages/Bookings';
import AddBooking from './pages/AddBooking';
import EditBooking from './pages/EditBooking';
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div>
       <Toaster position="top-right" />
<Navbar/>
      <Routes>
        <Route path="/" element={<Bookings />} />
        <Route path="/add" element={<AddBooking />} />
        <Route path="/edit/:id" element={<EditBooking />} />
      </Routes>
    </div>
  )
}

export default App