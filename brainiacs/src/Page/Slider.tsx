import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface SliderItem {
  _id: string;
  imageUrl: string;
  mobileImageUrl: string;
  redirectLink?: string;
  status: 'Active' | 'Inactive';
}

function Slider() {
  const [data, setData] = useState<SliderItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Unified Breakpoint Logic
  useEffect(() => {
    const handleResize = () => {
      // Logic covering mobile & small tablets based on your list
      setIsMobile(window.innerWidth <= 768); 
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // 2. Preload Logic
  useEffect(() => {
    if (data.length > 0) {
      data.forEach((item) => {
        const img = new Image();
        img.src = isMobile && item.mobileImageUrl ? item.mobileImageUrl : item.imageUrl;
      });
    }
  }, [data, isMobile]);

  if (data.length === 0) return null;

  return (
    <div className="slider-wrapper">
      <style>
        {`
          :root {
            /* Fluid height using aspect ratio is better for 4K/TVs and Mobile */
            --slider-aspect-ratio: 21 / 9; 
            --slider-mobile-aspect-ratio: 4 / 5;
          }

          .slider-wrapper {
            width: 100%;
            overflow: hidden;
            background-color: #000;
          }

          .carousel-item {
            /* This ensures the slider grows perfectly with screen width */
            width: 100%;
            aspect-ratio: var(--slider-aspect-ratio);
            min-height: 300px; /* Prevents it from disappearing */
            max-height: 85vh;   /* Prevents it from being too tall on huge monitors */
          }

          .slide-image-container {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transition: transform 0.5s ease;
          }

          /* Handle Mobile Resolutions (iPhone 16, Samsung S series, etc) */
          @media (max-width: 768px) {
            .carousel-item {
              aspect-ratio: var(--slider-mobile-aspect-ratio);
              max-height: 70vh;
            }
          }

          /* Custom Arrows & Indicators */
          .carousel-control-prev, .carousel-control-next {
            width: 5%;
            opacity: 0.8;
          }

          .nav-circle {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .nav-circle:hover {
            background: rgba(0, 0, 0, 0.6);
            transform: scale(1.1);
          }

          .carousel-indicators [data-bs-target] {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin: 0 6px;
            border: 2px solid #fff;
            background-color: transparent;
          }

          .carousel-indicators .active {
            background-color: #fff;
          }
        `}
      </style>

      <Carousel
        activeIndex={activeIndex}
        onSelect={(idx) => setActiveIndex(idx)}
        interval={5000}
        pause="hover"
        fade={true}
        indicators={true}
        nextIcon={
          <div className="nav-circle">
            <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </div>
        }
        prevIcon={
          <div className="nav-circle">
            <svg width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg>
          </div>
        }
      >
        {data.map((slide) => {
          const activeImage = isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl;

          return (
            <Carousel.Item key={slide._id}>
              <a 
                href={slide.redirectLink || '#'} 
                target={slide.redirectLink ? "_blank" : "_self"} 
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="slide-image-container"
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
              </a>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}

export default Slider;