import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from "./Page/Topbar";
import Products from './Page/Products';
import Navbar from './Page/Navbar';
import Footer from './Page/Footer';
import Home from './Page/Home';
import Inquiries from './Page/inquiries';
import Aboutus from './Page/About Us';


function App() {
  return (
    <Router>
      <Topbar />
      <Navbar/>     
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/inquiries" element={<Inquiries/>} />
         <Route path="/aboutus" element={<Aboutus/>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        {/* Add routes for settings if needed */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
