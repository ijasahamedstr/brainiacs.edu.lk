import About from "./About";
import CampusOffers from "./Campus_Offers";
import Guidance from "./Guidance";
import NewsEvent from "./News_event";
import Slider from "./Slider";
import Testimonials from "./Testimonials";

const Home: React.FC = () => {
  return (
    <>
    <Slider/>
    <CampusOffers/>
    <About/>
    <Testimonials/>
    <NewsEvent/>
    <Guidance/>
    </>
  );
};

export default Home;
