import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "../App";
import Shop from "../pages/shop/Shop";
import Quotes from "../pages/quotes/Quotes";
import AdminPanel from "../components/admin/AdminPanel";
import Profile from "../pages/profile/Profile";
import Dashboard from "../pages/dashboard/Dashboard";
import { PrivateRoute } from "./PrivateRoute";
import NavBar from "../components/common/Nav";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

export default function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/shop" element={<Shop />} />
        <Route path="/servicios" element={<Quotes />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
