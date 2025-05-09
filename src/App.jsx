import './App.css'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login';
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
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
    </Router>
  )
}

export default App
