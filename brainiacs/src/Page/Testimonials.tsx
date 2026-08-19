// src/components/Testimonials.tsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const primaryFont = '"Montserrat", sans-serif';

interface Testimonial {
  _id: string;
  name: string;
  course: string;
  batch: string;
  description: string;
  image: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  // State for the Pop Screen (Modal)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  // Responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Testimonials from Backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/AskOurStudent`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data: Testimonial[] = await response.json();
        
        // LAST IN FIRST OUT (LIFO) sorting
        const sortedData = data.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setTestimonials(sortedData);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  if (testimonials.length === 0) {
      return null; 
  }

  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        fontFamily: primaryFont, // Applied globally to the wrapper
        padding: isMobile
          ? "30px 10px 60px"
          : isTablet
          ? "40px 20px 70px"
          : "60px 0 80px",
        backgroundColor: "#F3F4F6",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Section Heading */}
      <h3
        style={{
          fontFamily: primaryFont,
          fontSize: isMobile ? "16px" : "18px",
          fontWeight: 500,
          color: "#111",
          marginBottom: "8px",
        }}
      >
        Ask our students,
      </h3>
      <h2
        style={{
          fontFamily: primaryFont,
          fontSize: isMobile ? "24px" : isTablet ? "28px" : "36px",
          fontWeight: 700,
          color: "#0b1033",
          marginBottom: isMobile ? "20px" : "40px",
        }}
      >
        How they feel
      </h2>

      {/* Swiper Slider */}
      <Swiper
        initialSlide={0}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        // Original swiper settings
        slidesPerView={isMobile ? 1 : isTablet ? 1.2 : 1.3}
        spaceBetween={isMobile ? 10 : isTablet ? 15 : 20}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1.5,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        style={{
          width: "100%",
          maxWidth: "900px",
          paddingBottom: isMobile ? "40px" : "50px",
          perspective: "100px",
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide
            key={item._id || index}
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #ddd",
              width: isMobile ? "90%" : "85%",
              maxWidth: "750px",
              overflow: "hidden",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              transition: "transform 0.5s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row", // Original Horizontal layout
                alignItems: "stretch", 
                textAlign: isMobile ? "center" : "left",
                height: "100%",
              }}
            >
              {/* Image */}
              <div
                style={{
                  flex: isMobile ? "none" : "0 0 45%",
                  width: isMobile ? "100%" : "auto",
                  height: isMobile ? "250px" : "auto", 
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", 
                    display: "block",   
                  }}
                />
              </div>

              {/* Text Content */}
              <div
                style={{
                  flex: 1,
                  padding: isMobile ? "20px" : "30px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center", 
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    fontFamily: primaryFont,
                  }}
                >
                  {item.name}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#666",
                    marginBottom: "4px",
                  }}
                >
                  {item.course}
                </p>
                <p
                  style={{
                    fontSize: isMobile ? "12px" : "13px",
                    color: "#999",
                    marginBottom: "15px",
                  }}
                >
                  {item.batch}
                </p>

                {/* Truncated Text */}
                <div
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#444",
                    lineHeight: 1.6,
                    fontWeight: 500,
                    display: "-webkit-box",
                    WebkitLineClamp: 3, // Limits text to 3 lines
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description}
                </div>

                {/* Read More Button */}
                <button
                  onClick={() => setSelectedTestimonial(item)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0b1033",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    marginTop: "10px",
                    alignSelf: isMobile ? "center" : "flex-start", 
                    fontFamily: primaryFont, // Ensure button matches
                  }}
                >
                  Read More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pop Screen (Modal) - Uses the exact same old design layout */}
      {selectedTestimonial && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999, 
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setSelectedTestimonial(null)} 
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "750px", // Exact same size as the card
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row", // Exact same layout as the card
              animation: "fadeIn 0.3s ease-in-out", 
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTestimonial(null)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(0,0,0,0.1)",
                color: "#333",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                fontFamily: primaryFont,
              }}
            >
              ✕
            </button>

            {/* Modal Image */}
            <div
              style={{
                flex: isMobile ? "none" : "0 0 45%",
                width: isMobile ? "100%" : "auto",
                height: isMobile ? "250px" : "auto", 
                overflow: "hidden",
              }}
            >
              <img
                src={selectedTestimonial.image}
                alt={selectedTestimonial.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {/* Modal Text Content (Full View - No Truncation) */}
            <div
              style={{
                flex: 1,
                padding: isMobile ? "20px" : "30px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  fontFamily: primaryFont,
                }}
              >
                {selectedTestimonial.name}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#666",
                  marginBottom: "4px",
                }}
              >
                {selectedTestimonial.course}
              </p>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "13px",
                  color: "#999",
                  marginBottom: "15px",
                }}
              >
                {selectedTestimonial.batch}
              </p>
              <p
                style={{
                  fontSize: isMobile ? "13px" : "14px",
                  color: "#444",
                  lineHeight: 1.6,
                  fontWeight: 500,
                  whiteSpace: "pre-wrap", 
                }}
              >
                {selectedTestimonial.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Adding Keyframes for the modal pop-in effect */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;