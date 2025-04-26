import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Profile from "../components/Dashboard/Profile";
import PaymentPlan from "../components/Dashboard/PaymentPlan";
import PaymentHistory from "../components/Dashboard/PaymentHistory";
import MyLands from "../components/Dashboard/MyLands";
import AvailableLands from "../components/Lands/AvailableLands";
import LandDetails from "../components/Lands/LandDetails";
import WhyUs from "../pages/WhyUs";
import Blog from "../pages/Blog";
import BookInspection from "../pages/BookInspection";

function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/dashboard/profile" element={<Profile />} />
      <Route path="/dashboard/payment-plan" element={<PaymentPlan />} />
      <Route path="/dashboard/payment-history" element={<PaymentHistory />} />
      <Route path="/dashboard/my-lands" element={<MyLands />} />
      <Route path="/lands/available" element={<AvailableLands />} />
      <Route path="/lands/details" element={<LandDetails />} />
      <Route path="/why-us" element={<WhyUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/book-inspection" element={<BookInspection />} />
    </Routes>
  );
}

export default CustomerRoutes;
