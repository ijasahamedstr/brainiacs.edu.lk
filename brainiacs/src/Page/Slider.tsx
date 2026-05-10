import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface SliderItem {
  _id: string;
  imageUrl: string;
  redirectLink?: string;
  status: 'Active' | 'Inactive';
}

const SLIDER_HEIGHT = '600px';

function Slider() {
  const [data, setData] = useState<SliderItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sliders`);
      if (!response.ok) throw new Error('Network response was not ok');
      const result: SliderItem[] = await response.json();
      setData(result.filter((item) => item.status === 'Active'));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data.length > 0) {
      data.forEach((item) => {
        const img = new Image();
        img.src = item.imageUrl;
      });
    }
  }, [data]);

  // --- Mobile Responsive Styles ---
  const arrowStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '50%',
    width: '40px', // Slightly smaller for mobile touch
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const containerStyle: React.CSSProperties = { 
    height: SLIDER_HEIGHT, // Forces same height on mobile
    width: '100%',
    backgroundColor: '#1a1a1a', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundSize: 'cover', // Ensures image fills the 600px height
    backgroundPosition: 'center', // Keeps subject centered
    backgroundRepeat: 'no-repeat'
  };

  if (data.length === 0) {
    return <div style={{ height: SLIDER_HEIGHT, backgroundColor: '#1a1a1a' }} />;
  }

  return (
    <div className="slider-wrapper" style={{ width: '100%', overflow: 'hidden' }}>
      <style>
        {`
          /* Custom overrides for Bootstrap indicators on mobile */
          .carousel-indicators [data-bs-target] {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 5px;
          }
          /* Ensure the carousel item doesn't collapse */
          .carousel-item {
            height: ${SLIDER_HEIGHT};
          }
        `}
      </style>

      <Carousel
        activeIndex={activeIndex}
        onSelect={(idx) => setActiveIndex(idx)}
        interval={5000}
        pause="hover"
        nextIcon={<div style={arrowStyle}><svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg></div>}
        prevIcon={<div style={arrowStyle}><svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg></div>}
        indicators={true}
        fade={true}
      >
        {data.map((slide) => (
          <Carousel.Item key={slide._id}>
            <a 
              href={slide.redirectLink || '#'} 
              target={slide.redirectLink ? "_blank" : "_self"} 
              rel="noreferrer"
            >
              <div 
                style={{ 
                  ...containerStyle,
                  backgroundImage: `url(${slide.imageUrl})`,
                }}
              />
            </a>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Slider;