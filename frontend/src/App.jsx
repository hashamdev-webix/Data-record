import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import CleanerDashboard from "./pages/CleanerDashboard";
import AddBooking from "./pages/AddBooking";
import EditBooking from "./pages/EditBooking";
import UserManagement from "./pages/UserManagement";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/cleaner"} replace />;
  }
  return children;
};

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      <Toaster position="top-right" />
      {user && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/cleaner"} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cleaner"
          element={
            <ProtectedRoute allowedRoles={["cleaner"]}>
              <CleanerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/cleaner"} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={user ? (user.role === "admin" ? "/admin" : "/cleaner") : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
