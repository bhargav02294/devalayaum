import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ====== GLOBAL COMPONENTS ====== */
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import WhatsAppButton from "./components/WhatsAppButton";

/* ====== HOME SECTIONS ====== */
import HomeTemples from "./components/HomeTemples";
import HomePujas from "./components/HomePujas";
import HomeDonations from "./components/HomeDonations";
import HomeProducts from "./components/HomeProducts";
import HomeAartis from "./components/HomeAartis";
import HomeReviews from "./components/HomeReviews";
import WhyChooseUs from "./components/WhyChooseUs";

/* ====== PUBLIC PAGES ====== */
import About from "./pages/About";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Donors from "./pages/Donors";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import MyAccount from "./pages/MyAccount";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";

import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";

/* ====== TEMPLE / PUJA / DONATION ====== */
import TemplesList from "./pages/TemplesList";
import TempleView from "./pages/TempleView";

import PujasList from "./pages/PujasList";
import PujaView from "./pages/PujaView";
import PujaBooking from "./pages/PujaBooking";

import DonationsList from "./pages/DonationsList";
import DonationView from "./pages/DonationView";

/* ====== PRODUCTS ====== */
import ProductsList from "./pages/ProductsList";
import ProductView from "./pages/ProductView";

/* ====== AARTI ====== */
import AartisList from "./pages/AartisList";
import AartiView from "./pages/AartiView";

/* ====== ADMIN ====== */
import AdminLogin from "./admin/pages/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import ProtectedRoute from "./admin/ProtectedRoute";
import Dashboard from "./admin/pages/Dashboard";

import Products from "./admin/pages/Products";
import ProductForm from "./admin/pages/ProductForm";

import Donations from "./admin/pages/Donations";
import DonationForm from "./admin/pages/DonationForm";

import Temples from "./admin/pages/Temples";
import TempleForm from "./admin/pages/TempleForm";

import Pujas from "./admin/pages/Pujas";
import PujaForm from "./admin/pages/PujaForm";

import Aartis from "./admin/pages/Aartis";
import AartiForm from "./admin/pages/AartiForm";

/* ====== SEO ====== */
import SeoManager from "./seo/SeoManager";

export default function App() {
  return (
    <Router>
      {/* ✅ GLOBAL SEO HANDLER */}
      <SeoManager />

      <Routes>
        {/* ================= HOME ================= */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <HomeTemples />
              <HomePujas />
              <HomeDonations />
              <HomeProducts />
              <HomeAartis />
              <HomeReviews />
              <WhyChooseUs />
              <Footer />
            </>
          }
        />

        {/* ================= STATIC PAGES ================= */}
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/donate" element={<><Navbar /><Donate /><Footer /></>} />

        <Route path="/terms" element={<><Navbar /><TermsAndConditions /><Footer /></>} />
        <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
        <Route path="/shipping" element={<><Navbar /><ShippingPolicy /><Footer /></>} />
        <Route
          path="/cancellation-refund"
          element={<><Navbar /><CancellationRefundPolicy /><Footer /></>}
        />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/verify-otp" element={<><Navbar /><VerifyOTP /><Footer /></>} />

        <Route path="/my-account" element={<><Navbar /><MyAccount /><Footer /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /><Footer /></>} />
<Route
  path="/order-success"
  element={<><Navbar /><OrderSuccess /><Footer /></>}
/>
        <Route path="/donors" element={<><Navbar /><Donors /><Footer /></>} />

        {/* ================= PUJAS ================= */}
        <Route path="/pujas" element={<><Navbar /><PujasList /><Footer /></>} />
        <Route path="/pujas/:id" element={<><Navbar /><PujaView /><Footer /></>} />
        <Route path="/pujas/:id/book/:pkgKey" element={<><Navbar /><PujaBooking /><Footer /></>} />

        {/* ================= DONATIONS ================= */}
        <Route path="/donations" element={<><Navbar /><DonationsList /><Footer /></>} />
        <Route path="/donations/:id" element={<><Navbar /><DonationView /><Footer /></>} />

        {/* ================= TEMPLES ================= */}
        <Route path="/temples" element={<><Navbar /><TemplesList /><Footer /></>} />
        <Route path="/temples/:id" element={<><Navbar /><TempleView /><Footer /></>} />

        {/* ================= PRODUCTS ================= */}
        <Route path="/products" element={<><Navbar /><ProductsList /><Footer /></>} />
        <Route path="/products/:id" element={<><Navbar /><ProductView /><Footer /></>} />

        {/* ================= AARTI ================= */}
        <Route path="/aarti" element={<><Navbar /><AartisList /><Footer /></>} />
        <Route path="/aarti/:id" element={<><Navbar /><AartiView /><Footer /></>} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />

          {/* Donations */}
          <Route path="donations" element={<Donations />} />
          <Route path="donations/new" element={<DonationForm />} />
          <Route path="donations/edit/:id" element={<DonationForm />} />

          {/* Temples */}
          <Route path="temples" element={<Temples />} />
          <Route path="temples/add" element={<TempleForm />} />
          <Route path="temples/edit/:id" element={<TempleForm />} />

          {/* Pujas */}
          <Route path="pujas" element={<Pujas />} />
          <Route path="pujas/new" element={<PujaForm />} />
          <Route path="pujas/edit/:id" element={<PujaForm />} />

          {/* Aartis */}
          <Route path="aartis" element={<Aartis />} />
          <Route path="aartis/add" element={<AartiForm />} />
          <Route path="aartis/edit/:id" element={<AartiForm />} />
        </Route>
      </Routes>

      {/* ✅ FLOATING CTA */}
      <WhatsAppButton />
    </Router>
  );
}
