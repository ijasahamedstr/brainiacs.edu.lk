import React, { useRef, useState, useEffect } from "react";

interface Card {
  image: string;
}

const originalCards: Card[] = [
  { image: "https://i.ibb.co/5WYBwDTB/lyceum-global-foundation-lyceum-campus.webp" },
  { image: "https://i.ibb.co/JWjhJFDQ/bachelor-of-education-honours-in-primary-education-lyceum-campus.webp" },
  { image: "https://i.ibb.co/rK3DCX3s/deakin-pathway-programme-lyceum-campus.webp" },
  { image: "https://i.ibb.co/LXcwRYJK/btec-hnd-in-computing-lyceum-campus.webp" },
  { image: "https://i.ibb.co/Xrh30TJf/btec-hnd-in-business-lyceum-campus.webp" },
  { image: "https://i.ibb.co/fVBRFMxt/teacher-training-diplomas-lyceum-campus-3.webp" },
];

const cards = [...originalCards, ...originalCards, ...originalCards];

const CampusOffers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth / 3;
    }
  }, []);

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
    const scrollAmount = cardWidth + 40; 
    container.scrollTo({
      left: container.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount),
      behavior: "smooth",
    });
  };

  const startDragging = (e: any) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    const pageX = e.pageX || e.touches[0].pageX;
    setStartX(pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const moveDragging = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    const pageX = e.pageX || e.touches[0].pageX;
    const x = pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  return (
    <div className="campus-offers-container">
      <div className="header-section">
        <div className="heading-group">
          <h2 className="campus-heading">
            <span className="gradient-text">Brainiacs</span> Campus Offers
          </h2>
          <div className="heading-line"></div>
        </div>

        <div className="arrow-controls">
          <button className="nav-arrow" onClick={() => scroll("left")} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="nav-arrow" onClick={() => scroll("right")} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

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
            key={index} 
            className="original-card" 
            style={{ backgroundImage: `url(${card.image})` }}
          >
            <div className="card-color-overlay"></div>
            
            <div className="card-btn-container">
              {/* NEW RECTANGLE OFFICIAL BUTTON */}
              <button className="official-card-btn">
                LEARN MORE
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');

        .campus-offers-container {
          padding: 60px 5% 0 5%;
          background: #ffffff;
          overflow: hidden;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          max-width: 1400px;
          margin-inline: auto;
        }

        .campus-heading {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 600;
          color: #474747;
          margin: 0;
        }

        .gradient-text { color: #0054f8; }

        .heading-line {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #0054f8, #00d2ff);
          border-radius: 2px;
          margin-top: 8px;
        }

        .arrow-controls { display: flex; gap: 8px; }

        .nav-arrow {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          background: white;
          color: #474747;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }

        .nav-arrow:hover {
          background: #0054f8;
          color: white;
          border-color: #0054f8;
        }

        .slider-viewport {
          display: flex;
          gap: clamp(20px, 2vw, 40px);
          overflow-x: auto;
          user-select: none;
          padding-bottom: 40px;
          scroll-behavior: smooth;
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .original-card {
          flex: 0 0 clamp(250px, 30%, 497px);
          aspect-ratio: 497 / 225;
          background-size: cover;
          background-position: center;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .card-color-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 84, 248, 0.25) 0%, rgba(0, 0, 0, 0.2) 100%);
          pointer-events: none;
        }

        .card-btn-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 20px;
          z-index: 2;
        }

        /* --- NEW OFFICIAL BUTTON STYLE --- */
        .official-card-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          color: #1a1a1a;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .official-card-btn:hover {
          background: #0054f8;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 84, 248, 0.3);
        }

        @media (max-width: 480px) {
          .original-card { flex: 0 0 90% !important; }
          .arrow-controls { display: none; }
        }
      `}</style>
    </div>
  );
};

export default CampusOffers;