import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/prot_route";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PolicyPurchase from "./pages/PolicyPurchase";
import Profile from "./pages/profile";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AdminUsers from "./pages/admin/admin-users";

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans bg-slate-50 text-slate-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User / Partner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "partner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/purchase"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <PolicyPurchase />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback Route */}
          <Route
            path="*"
            element={
              <div className="p-8 text-center text-xl font-bold">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
