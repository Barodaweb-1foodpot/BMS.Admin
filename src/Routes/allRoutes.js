import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import UserProfile from "../pages/Authentication/user-profile";
import AdminUser from "../pages/Auth/AdminUser";
import { Dashboard } from "../pages/Masters/Dashboard";
import CompanyMaster from "../pages/Masters/CompanyMaster";
import ProductMaster from "../pages/Masters/ProductMaster";
import QRMaster from "../pages/Masters/QRMaster";
import { QRData } from "../pages/Masters/QRData";
const authProtectedRoutes = [
  { path: "/profile", component: <UserProfile /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/company-master", component: <CompanyMaster /> },
  { path: "/product-master", component: <ProductMaster /> },
  { path: "/qr-master", component: <QRMaster /> },
  { path: "/ProductQR/:id", component: <QRData /> },


  {
    path: "/",
    exact: true,
    component: <Navigate to="/category" />,
  },
  { path: "*", component: <Navigate to="/category" /> },
];

const publicRoutes = [
  { path: "/", component: <Login /> },
];

export { authProtectedRoutes, publicRoutes };
