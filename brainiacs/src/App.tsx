import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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


function App() {
  return (
    <Router>
      <Navbar/>     
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/inquiries" element={<Inquiries/>} />
        <Route path="/aboutus" element={<Aboutus/>} />
        <Route path="/Presidentmessage" element={<Presidentmessage/>} />
        <Route path="/leadersip-governance" element={<Leadersipgovernance/>} />
        <Route path="/events/uni-sittham" element={<Studentlifeview/>} />
        <Route path="/events" element={< Events/>} />
        <Route path="/events/uni-sittham" element={< Event_view/>} />
        <Route path="/partners" element={< Partners/>} />
        <Route path="/student-life" element={< Studentlife/>} />
        <Route path="/News" element={< News/>} />
        <Route path="/events/uni-sittham-nes" element={< NewsView/>} />
        <Route path="/programmes/foundation-business" element={< Course/>} />
        <Route path="/pricing" element={<div>Pricing Page</div>} />
        <Route path="/blog" element={<div>Blog Page</div>} />
        {/* Add routes for settings if needed */}

        <Route path="/login" element={< Login/>} />
        
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
