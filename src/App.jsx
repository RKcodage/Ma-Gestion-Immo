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

// Dashboard
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from "./components/dashboard/DashboardHome";

// Protected routes
import RoleRoute from './routes/RoleRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
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
          <Route path="properties" element={<Properties />}/>
          <Route path="property/:propertyId" element={<PropertyDetails />}/>
        </Route>

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  )
}

export default App
