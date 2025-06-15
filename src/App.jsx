import './App.css'
import { useEffect } from "react";
// Cookies
import Cookies from "js-cookie";
import CookieConsent from "react-cookie-consent";
// Toast
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login';
import LegalMentions from './pages/LegalMentions';
import Cgu from './pages/Cgu';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ChooseRole from './pages/ChooseRole';
import UserAccount from './pages/UserAccount';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Leases from './pages/Leases';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from "./components/dashboard/DashboardHome";

// Import utils
import ScrollToTop from './utils/ScrollToTop';

// Protected routes
import RoleRoute from './routes/RoleRoute';
import OwnerRoute from './routes/OwnerRoute';

function App() {

  useEffect(() => {
    const consent = Cookies.get("userConsent");
    console.log("Consentement actuel :", consent); 

    if (consent === "true") {
      console.log("L'utilisateur a accepté les cookies.");
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/invitation/:token" element={<Signup />} /> // Sign Up route with invitation 
        <Route path="/login" element={<Login />} />
        <Route path="/legal-mentions" element={<LegalMentions />} />
        <Route path="/cgu" element={<Cgu/>} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/role"
          element={
            <RoleRoute>
              <ChooseRole />
            </RoleRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="account" element={<UserAccount />} />
          <Route path="properties" element={
            <OwnerRoute>
              <Properties />
            </OwnerRoute>}
          />
          <Route path="property/:propertyId" element={
            <OwnerRoute>
              <PropertyDetails />
            </OwnerRoute>
          }
          />
          <Route path="leases" element={<Leases />}/>
          <Route path="documents" element={<Documents />}/>
          <Route path="chat" element={<Chat/>}/>
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <CookieConsent
        location="bottom"
        buttonText="J'accepte"
        declineButtonText="Je refuse"
        enableDeclineButton
        cookieName="userConsent"
        style={{ background: "hsl(var(--primary))" }}
        buttonStyle={{
          color: "#fff",
          background: "#4CAF50",
          fontSize: "15px",
          borderRadius: "4px",
          padding: "10px 20px",
        }}
        declineButtonStyle={{
          background: "#f44336",
          color: "#fff",
          fontSize: "15px",
          borderRadius: "4px",
          padding: "10px 20px",
          marginLeft: "10px",
        }}
        expires={365}
      >
        Ce site utilise des cookies pour améliorer votre expérience.{" "}
        <a href="/privacy-policy" style={{ color: "#f1d600" }}>
          En savoir plus
        </a>
      </CookieConsent>
    </Router>
  )
}

export default App
