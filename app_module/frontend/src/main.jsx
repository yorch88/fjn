import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./pages/Home.jsx";
import Login from "./modules/auth/Login.jsx";
import RequireAuth from "./modules/auth/RequireAuth.jsx";

// INVENTORY
import InventoryReports from "./modules/inventory/pages/InventoryReports.jsx";
import InventoryCreate from "./modules/inventory/pages/InventoryCreate.jsx";
import InventoryUpdate from "./modules/inventory/pages/InventoryUpdate.jsx";
import InventorySilverHours from "./modules/inventory/pages/InventorySilverHours";

// LOCATIONS
import LocationsList from "./modules/locations/pages/LocationsList.jsx";
import LocationCreate from "./modules/locations/pages/LocationCreate.jsx";

// TASKS
import TasksCreate from "./modules/tasks/pages/TasksCreate.jsx";
import TasksReports from "./modules/tasks/pages/TasksReports.jsx";
import TasksDetail from "./modules/tasks/pages/TasksDetail.jsx";

// RECEIVING
import ReceivingCreate from "./modules/receiving/pages/ReceivingCreate.jsx";
import ReceivingDetail from "./modules/receiving/pages/ReceivingDetail.jsx";
import ReceivingList from "./modules/receiving/pages/ReceivingList.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
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

        <Route
          path="/inventory/silver-hours"
          element={
            <RequireAuth>
              <InventorySilverHours />
            </RequireAuth>
          }
        />

        {/* RECEIVING */}
        <Route
          path="/receiving"
          element={
            <RequireAuth>
              <ReceivingList />
            </RequireAuth>
          }
        />

        <Route
          path="/receiving/create"
          element={
            <RequireAuth>
              <ReceivingCreate />
            </RequireAuth>
          }
        />

        <Route
          path="/receiving/:id"
          element={
            <RequireAuth>
              <ReceivingDetail />
            </RequireAuth>
          }
        />

        {/* TASKS */}
        <Route
          path="/task/all"
          element={
            <RequireAuth>
              <TasksReports />
            </RequireAuth>
          }
        />

        <Route
          path="/task/create"
          element={
            <RequireAuth>
              <TasksCreate />
            </RequireAuth>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <RequireAuth>
              <TasksDetail />
            </RequireAuth>
          }
        />

        {/* LOCATIONS */}
        <Route
          path="/locations"
          element={
            <RequireAuth>
              <LocationsList />
            </RequireAuth>
          }
        />

        <Route
          path="/locations/create"
          element={
            <RequireAuth>
              <LocationCreate />
            </RequireAuth>
          }
        />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
