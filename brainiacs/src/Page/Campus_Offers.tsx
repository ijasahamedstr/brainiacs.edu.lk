import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface CourseCard {
  _id: string;
  courseName: string;
  coverImage: string;
}

const CampusOffers: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [rawCards, setRawCards] = useState<CourseCard[]>([]);
  const [cards, setCards] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. Fetch ALL courses from the API
  useEffect(() => {
    const fetchOfferings = async () => {
      try {
        setLoading(true);
        // Changed endpoint to fetch all courses instead of filtering by isCampusOffering
        const response = await fetch(`${API_BASE_URL}/api/course`);
        if (!response.ok) {
          throw new Error("Failed to load courses");
        }
        const data = await response.json();
        setRawCards(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOfferings();
  }, []);

  // 2. Duplicate the cards array for the infinite seamless slider carousel loop effect
  useEffect(() => {
    if (rawCards.length > 0) {
      setCards([...rawCards, ...rawCards, ...rawCards]);
    }
  }, [rawCards]);

  // 3. Reset scroll track into center section to allow both left/right infinite scroll loops
  useEffect(() => {
    const container = containerRef.current;
    if (container && cards.length > 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, [cards]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const sectionWidth = container.scrollWidth / 3;

    if (container.scrollLeft >= sectionWidth * 2) {
      container.scrollLeft -= sectionWidth;
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft += sectionWidth;
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = container.querySelector(".original-card")?.clientWidth || 300;
    const gap = 20;
    const scrollAmount = cardWidth + gap;

    container.scrollTo({
      left: container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount),
      behavior: "smooth",
    });
  };

  const startDragging = (e: any) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
    setStartX(pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const moveDragging = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    const pageX = e.pageX || (e.touches && e.touches[0].pageX);
    const x = pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  if (loading) {
    return (
      <div className="campus-offers-status">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || rawCards.length === 0) {
    return (
      <div className="campus-offers-status">
        <p>{error ? `Error: ${error}` : "No courses available at the moment."}</p>
      </div>
    );
  }

  return (
    <div className="campus-offers-container">
      {/* Navigation Controls */}
      <div className="navigation-wrapper">
        <div className="arrow-controls">
          <button className="nav-arrow" onClick={() => scroll("left")} aria-label="Previous">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button className="nav-arrow" onClick={() => scroll("right")} aria-label="Next">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider Core Viewport */}
      <div
        ref={containerRef}
        className="slider-viewport hide-scrollbar"
        onMouseDown={startDragging}
        onMouseMove={moveDragging}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onTouchStart={startDragging}
        onTouchMove={moveDragging}
        onTouchEnd={stopDragging}
        onScroll={handleScroll}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {cards.map((card, index) => (
          <div
            key={`${card._id}-${index}`}
            className="original-card"
            style={{ backgroundImage: `url(${card.coverImage})` }}
          >
            <div className="card-color-overlay"></div>

            <div className="card-btn-container">
              <button 
                className="official-card-btn" 
                onClick={() => navigate(`/courses/${card._id}`)}
              >
                LEARN MORE
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .campus-offers-container {
          width: 100%;
          /* Added 40px padding to the bottom */
          padding: 30px clamp(12px, 4vw, 80px) 40px;
          background: #ffffff;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }

        .campus-offers-status {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 250px;
          font-family: 'Montserrat', sans-serif;
          color: #666;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0054f8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .navigation-wrapper {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 18px;
        }

        .arrow-controls {
          display: flex;
          gap: 8px;
        }

        .nav-arrow {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          border: 1px solid #e5e5e5;
          background: #ffffff;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.25s ease;
        }

        .nav-arrow:hover {
          background: #0054f8;
          color: #ffffff;
          border-color: #0054f8;
        }

        .slider-viewport {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          user-select: none;
          padding-bottom: 24px;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* DYNAMIC CARD SETUP */
        .original-card {
          flex: 0 0 clamp(260px, 30vw, 430px);
          aspect-ratio: 497 / 225;
          background-size: cover;
          background-position: center;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        }

        .card-color-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.65) 0%,
            rgba(0,0,0,0.2) 60%,
            rgba(0,0,0,0.1) 100%
          );
          z-index: 1;
        }

        .card-content-overlay {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          z-index: 2;
        }

        .card-title-badge {
          background: rgba(10, 83, 151, 0.9);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 4px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          display: inline-block;
          max-width: 90%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-btn-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          z-index: 2;
        }

        /* PREMIUM BUTTON SETUP */
        .official-card-btn {
          border: none;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          color: #111;
          padding: 8px 14px;
          border-radius: 7px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .official-card-btn:hover {
          background: #0054f8;
          color: #ffffff;
          transform: translateY(-2px);
        }

        /* Responsive Breakpoints */
        @media (max-width: 576px) {
          .campus-offers-container {
            /* Added 30px padding to the bottom for mobile screens */
            padding: 16px 12px 30px;
          }
          .navigation-wrapper {
            display: none;
          }
          .slider-viewport {
            gap: 14px;
            padding-bottom: 18px;
          }
          .original-card {
            flex: 0 0 82% !important;
            aspect-ratio: 16 / 10;
            border-radius: 14px;
          }
          .card-content-overlay {
            top: 12px;
            left: 12px;
          }
          .card-btn-container {
            padding: 12px;
          }
          .official-card-btn {
            padding: 7px 12px;
            font-size: 10px;
            gap: 6px;
            border-radius: 6px;
          }
          .official-card-btn svg {
            width: 11px;
            height: 11px;
          }
        }

        @media (max-width: 380px) {
          .original-card {
            flex: 0 0 88% !important;
          }
          .official-card-btn {
            padding: 6px 10px;
            font-size: 9px;
            gap: 5px;
          }
          .official-card-btn svg {
            width: 10px;
            height: 10px;
          }
        }

        @media (min-width: 577px) and (max-width: 1024px) {
          .original-card {
            flex: 0 0 45%;
          }
        }

        @media (min-width: 1920px) {
          .original-card {
            flex: 0 0 520px;
          }
        }
      `}</style>
    </div>
  );
};

export default CampusOffers;