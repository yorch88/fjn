import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home.jsx";
import Login from "./modules/auth/Login.jsx";
import RequireAuth from "./modules/auth/RequireAuth.jsx";

import InventoryReports from "./modules/inventory/pages/InventoryReports.jsx";
import InventoryCreate from "./modules/inventory/pages/InventoryCreate.jsx";
import InventoryUpdate from "./modules/inventory/pages/InventoryUpdate.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* MENU PRINCIPAL */}
        <Route path="/" element={<Home />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* INVENTORY */}
        <Route
          path="/inventory"
          element={
            <RequireAuth>
              <InventoryReports />
            </RequireAuth>
          }
        />
        <Route
          path="/inventory/new"
          element={
            <RequireAuth>
              <InventoryCreate />
            </RequireAuth>
          }
        />
        <Route
          path="/inventory/:id/edit"
          element={
            <RequireAuth>
              <InventoryUpdate />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
