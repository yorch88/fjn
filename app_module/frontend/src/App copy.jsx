import { Routes, Route } from "react-router-dom";

import Layout from "./modules/layout/Layout";

import Menu from "./modules/home/Menu";
import Login from "./modules/auth/Login";

import InventoryReports from "./modules/inventory/pages/InventoryReports";
import InventoryCreate from "./modules/inventory/pages/InventoryCreate";
import InventoryUpdate from "./modules/inventory/pages/InventoryUpdate";

import { PrivateRoute } from "./modules/auth/PrivateRoute";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryReports />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory/new"
          element={
            <PrivateRoute>
              <InventoryCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/inventory/:id/edit"
          element={
            <PrivateRoute>
              <InventoryUpdate />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  );
}
