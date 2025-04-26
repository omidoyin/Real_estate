import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminHeader from "./components/Admin/AdminHeader";
import Header from "./components/Shared/Header";
import AdminRoutes from "./routes/AdminRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <>
              <AdminHeader />
              <AdminRoutes />
            </>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/*"
          element={
            <>
              <Header />
              <CustomerRoutes />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
