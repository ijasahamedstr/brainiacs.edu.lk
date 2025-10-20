import React, { useRef, useState } from "react";

interface Card {
  image: string;
  title?: string;
  desc?: string;
}

const cards: Card[] = [
  { image: "https://i.ibb.co/5WYBwDTB/lyceum-global-foundation-lyceum-campus.webp" },
  { image: "https://i.ibb.co/JWjhJFDQ/bachelor-of-education-honours-in-primary-education-lyceum-campus.webp" },
  { image: "https://i.ibb.co/rK3DCX3s/deakin-pathway-programme-lyceum-campus.webp" },
  { image: "https://i.ibb.co/LXcwRYJK/btec-hnd-in-computing-lyceum-campus.webp" },
  { image: "https://i.ibb.co/Xrh30TJf/btec-hnd-in-business-lyceum-campus.webp" },
  { image: "https://i.ibb.co/fVBRFMxt/teacher-training-diplomas-lyceum-campus-3.webp" },
];

const CampusOffers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const containerStyle: React.CSSProperties = {
    padding: "60px 5% 0 5%",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "clamp(24px, 4vw, 36px)",
    fontWeight: 600,
    textAlign: "center",
    color: "#474747",
    fontFamily: '"Montserrat", sans-serif',
    marginBottom: "40px",
    position: "relative",
    letterSpacing: "0.5px",
  };

  const sliderWrapperStyle: React.CSSProperties = {
    overflowX: "auto",
    display: "flex",
    gap: "clamp(20px, 2vw, 50px)",
    scrollBehavior: "smooth",
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    paddingBottom: 0,
  };

  const cardStyle = (image: string): React.CSSProperties => ({
    flex: "0 0 clamp(250px, 30%, 497px)",
    aspectRatio: "497/225",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    overflow: "hidden",
  });

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "15px",
    left: "15px",
    padding: "8px 18px", // smaller height
    backgroundColor: "#ffffff",
    color: "rgb(0, 84, 248)",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "background 0.3s, color 0.3s",
  };

  const arrowStyle: React.CSSProperties = {
    fontSize: "20px", // bigger arrow
    display: "inline-block",
    transition: "transform 0.3s",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle} className="fancy-heading">
        Brainiacs Campus Offers
      </h2>

      <div
        ref={containerRef}
        style={sliderWrapperStyle}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="hide-scrollbar"
      >
        {cards.map((card, index) => (
          <div key={index} className="campus-card" style={cardStyle(card.image)}>
            <button style={buttonStyle}>
              View <span style={arrowStyle}>→</span>
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .fancy-heading::after {
          content: "";
          display: block;
          width: 80px;
          height: 4px;
          margin: 12px auto 0;
          background: linear-gradient(90deg, #0066ff, #00cc99);
          border-radius: 2px;
          animation: fadeInLine 1s ease forwards;
        }
        @keyframes fadeInLine { from { width: 0; opacity: 0; } to { width: 80px; opacity: 1; } }

        @media (max-width: 480px) { .campus-card { flex: 0 0 90% !important; } }
        @media (min-width: 481px) and (max-width: 1024px) { .campus-card { flex: 0 0 45% !important; } }
        @media (min-width: 1025px) { .campus-card { flex: 0 0 clamp(250px, 30%, 497px); } }

        @media (hover: hover) {
          .campus-card:hover { transform: scale(1.03); box-shadow: 0 12px 25px rgba(0,0,0,0.15); }
          .campus-card button:hover { background-color: rgb(0, 84, 248); color: #ffffff; }
          .campus-card button:hover span { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

export default CampusOffers;
