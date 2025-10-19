import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from "./Page/Topbar";
import Products from './Page/Products';
import Navbar from './Page/Navbar';
import Slider from './Page/Slider';
import CampusOffers from './Page/Campus_Offers';


function App() {
  return (
    <Router>
      <Topbar />
      <Navbar />
      <Slider/>
      <CampusOffers/>
      <Routes>
        <Route path="/products" element={<Products/>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        {/* Add routes for settings if needed */}
      </Routes>
    </Router>
  );
}

export default App;
