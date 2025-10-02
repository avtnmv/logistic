import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Homepage from './components/Homepage';
import SearchOrders from './components/SearchOrders';
import Security from './components/Security';
import Profile from './components/Profile';
import Companies from './components/Companies';
import Payments from './components/Payments';
import AdminPanel from './components/AdminPanel';
import { SidebarProvider } from './contexts/SidebarContext';
import './App.css';


const RouteDebugger: React.FC = () => {
  const location = useLocation();
  
  React.useEffect(() => {
  }, [location]);
  
  return null;
};

function App() {
  const basename = process.env.REACT_APP_BASENAME || '';
  
  return (
    <Router basename={basename}>
      <SidebarProvider>
        <div className="App">
          <RouteDebugger />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search-orders" element={<SearchOrders />} />
              <Route path="/homepage" element={<Homepage />} />
              <Route path="/my-transports" element={<Homepage />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/security" element={<Security />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </AnimatePresence>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
