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

  // 1. Mobile cutoff strictly set at 768px (Standard iPad/Tablet breakpoint)
  useEffect(() => {
    const handleResize = () => {
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

  // 2. Preload Logic to prevent flickering when switching slides
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
            /* EXACT ASPECT RATIOS MATCHING YOUR IMAGE SIZES */
            --slider-ratio-mobile: 1080 / 1350; /* Mobile image: 1080px by 1350px */
            --slider-ratio-desktop: 1920 / 820; /* Desktop image: 1920px by 820px */
          }

          .slider-wrapper {
            width: 100%;
            overflow: hidden;
            background-color: #000;
          }

          .slide-image-container {
            width: 100%;
            height: 100%;
            background-size: cover; 
            background-position: center center;
            background-repeat: no-repeat;
            transition: transform 0.5s ease;
          }

          /* -------------------------------------------
             ALL DEVICE RESPONSIVE CSS
             ------------------------------------------- */
             
          /* 1. Mobile Phones (Up to 768px) */
          .carousel-item {
            width: 100%;
            aspect-ratio: var(--slider-ratio-mobile);
            max-height: 85vh; /* Prevents the image from being taller than the screen on long phones */
          }

          /* 2. Tablets & Laptops (769px to 1439px) */
          @media (min-width: 769px) {
            .carousel-item {
              aspect-ratio: var(--slider-ratio-desktop);
              min-height: 350px; /* Prevents the ultra-wide banner from looking too thin on iPads */
            }
          }

          /* 3. Large Monitors & 4K Displays (1440px and up) */
          @media (min-width: 1440px) {
            .carousel-item {
              aspect-ratio: var(--slider-ratio-desktop);
              max-height: 820px; /* Hard caps the height at your image's exact pixel height (820px) so it doesn't get pixelated */
            }
          }

          /* -------------------------------------------
             CONTROLS & INDICATORS 
             ------------------------------------------- */
             
          .carousel-control-prev, .carousel-control-next {
            width: 5%;
            opacity: 0.8;
          }

          .nav-circle {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            padding: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .nav-circle:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: scale(1.1);
          }

          .carousel-indicators {
            margin-bottom: 1.5rem;
          }

          .carousel-indicators [data-bs-target] {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 6px;
            border: 2px solid #fff;
            background-color: transparent;
            transition: background-color 0.3s ease;
          }

          .carousel-indicators .active {
            background-color: #fff;
            transform: scale(1.2);
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
          // Serves correct image dynamically based on screen size
          const activeImage = isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl;

          return (
            <Carousel.Item key={slide._id}>
              <a 
                href={slide.redirectLink || '#'} 
                target={slide.redirectLink && slide.redirectLink !== '#' ? "_blank" : "_self"} 
                rel="noreferrer"
                style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}
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