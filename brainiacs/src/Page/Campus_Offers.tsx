import React, { useRef, useState, useEffect } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1;
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: "60px 5%",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "clamp(24px, 5vw, 40px)",
    fontWeight: 600,
    lineHeight: 1.3,
    marginBottom: "40px",
    color: "#000",
    fontFamily: '"Montserrat", sans-serif',
    textAlign: "center",
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
  };

  const cardStyle = (image: string): React.CSSProperties => ({
    flex: "0 0 clamp(250px, 30%, 497px)",
    aspectRatio: "497/225", // ensures responsive height based on width
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  });

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Brainiacs Campus Offers</h2>
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
          <div key={index} style={cardStyle(card.image)}></div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CampusOffers;
