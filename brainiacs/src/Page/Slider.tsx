import Carousel from 'react-bootstrap/Carousel';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const slides = [
  { src: "https://i.ibb.co/GQMJbGYt/experience-excellence-lyceum-campus.webp" },
  { src: "https://i.ibb.co/v45mkW4w/teacher-training-diploma-programme-lyceum-campus.webp" },
  { src: "https://i.ibb.co/0pGrR4Nx/pearson-level-5-hnd-in-business-lyceum-campus.webp" },
  { src: "https://i.ibb.co/ksK3KbqW/pearson-btec-hnd-level-5-computing-lyceum-campus.webp" },
  { src: "https://i.ibb.co/9kWyfsJQ/bed-hons-primary-education-programme-lyceum-campus.webp" },
  { src: "https://i.ibb.co/9zKQZdw/deakin-pathway-programme-lyceum-campus-1.webp" },
];

function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleSelect = (selectedIndex: number) => setActiveIndex(selectedIndex);

  // Background circle style
  const arrowWrapperStyle = {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '50%',
    width: '50px',      // slightly bigger background
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
  };

  // Bigger arrow icon
  const arrowIconStyle = {
    width: '25px',      // bigger arrow
    height: '25px',
    fill: '#fff',       // white arrow
  };

  // Custom SVG arrows
  const PrevArrow = (
    <div style={arrowWrapperStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
      </svg>
    </div>
  );

  const NextArrow = (
    <div style={arrowWrapperStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={arrowIconStyle}>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
      </svg>
    </div>
  );

  return (
    <Carousel
      activeIndex={activeIndex}
      onSelect={handleSelect}
      interval={3000}
      pause="hover"
      nextIcon={NextArrow}
      prevIcon={PrevArrow}
      indicators={true}
      slide={true}
    >
      {slides.map((slide, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={slide.src}
            alt={`slide-${index}`}
            style={{ objectFit: 'cover', maxHeight: '600px' }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Slider;
