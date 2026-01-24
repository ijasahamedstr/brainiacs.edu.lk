import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Products from './Page/Products';
import Navbar from './Page/Navbar';
import Footer from './Page/Footer';
import Home from './Page/Home';
import Inquiries from './Page/inquiries';
import Aboutus from './Page/About Us';
import Presidentmessage from './Page/Presidentmessage';
import Leadersipgovernance from './Page/leadersip-governance';
import Events from './Page/Events';
import Event_view from './Page/Event_view';
import Partners from './Page/Partners';
import Studentlife from './Page/Student-life';
import Studentlifeview from './Page/Student-life-view';
import News from './Page/News';
import NewsView from './Page/News-view';
import Course from './Page/coures';
import Login from './Page/Admin/Login';
import Dashboard from "./Page/Admin/Dashboard";

// --- Protected Route Component ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// --- Layout Wrapper Component ---
// This component handles the conditional visibility of Navbar and Footer
const AppContent = () => {
  const location = useLocation();
  
  // Define paths where you don't want Navbar/Footer
  const hideLayoutPaths = ['/login', '/dashboard', '/Dashboard'];
  const shouldHideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inquiries" element={<Inquiries />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/Presidentmessage" element={<Presidentmessage />} />
        <Route path="/leadersip-governance" element={<Leadersipgovernance />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/uni-sittham" element={<Event_view />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/student-life" element={<Studentlife />} />
        <Route path="/student-life/view" element={<Studentlifeview />} />
        <Route path="/News" element={<News />} />
        <Route path="/news/view" element={<NewsView />} />
        <Route path="/programmes/foundation-business" element={<Course />} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Example of a Protected Route (Dashboard) */}
         <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
};

// --- Main App Component ---
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;