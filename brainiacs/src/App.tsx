import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from "./Page/Topbar";
import Products from './Page/Products';
import Navbar from './Page/Navbar';
import Slider from './Page/Slider';
import CampusOffers from './Page/Campus_Offers';
import About from './Page/About';
import Footer from './Page/Footer';
import Guidance from './Page/Guidance';
import News_event from './Page/News_event';
import Testimonials from './Page/Testimonials';


function App() {
  return (
    <Router>
      <Topbar />
      <Navbar />
      <Slider/>
      <CampusOffers/>
      <About/>
      <Testimonials/>
      <News_event/>     
      <Routes>
        <Route path="/products" element={<Products/>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        {/* Add routes for settings if needed */}
      </Routes>
      <Guidance/>
      <Footer/>
    </Router>
  );
}

export default App;
