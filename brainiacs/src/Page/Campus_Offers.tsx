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

    const cardWidth =
      container.querySelector(".original-card")?.clientWidth || 300;

    const gap = 20;

    const scrollAmount = cardWidth + gap;

    container.scrollTo({
      left:
        container.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount),
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

  return (
    <div className="campus-offers-container">

      {/* Navigation */}
      <div className="navigation-wrapper">
        <div className="arrow-controls">

          <button
            className="nav-arrow"
            onClick={() => scroll("left")}
            aria-label="Previous"
          >
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

          <button
            className="nav-arrow"
            onClick={() => scroll("right")}
            aria-label="Next"
          >
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

      {/* Slider */}
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
              <button className="official-card-btn">
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
          padding: 30px clamp(12px, 4vw, 80px) 0;
          background: #ffffff;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
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

        /* CARD */
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
            135deg,
            rgba(0,0,0,0.05),
            rgba(0,0,0,0.12)
          );
        }

        .card-btn-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          z-index: 2;
        }

        /* BUTTON */
        .official-card-btn {
          border: none;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          color: #111;
          padding: 8px 14px;
          border-radius: 7px;
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

        /* ---------------- MOBILE ---------------- */

        @media (max-width: 576px) {

          .campus-offers-container {
            padding: 16px 12px 0;
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

        /* EXTRA SMALL DEVICES */

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

        /* TABLETS */

        @media (min-width: 577px) and (max-width: 1024px) {

          .original-card {
            flex: 0 0 45%;
          }
        }

        /* LARGE DESKTOP */

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