// src/components/Testimonials.tsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// --- CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Testimonial {
  _id: string;
  name: string;
  course: string;
  batch: string;
  description: string; // From database schema
  image: string;
  createdAt: string;
}

const Testimonials: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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
        
        // LAST IN FIRST OUT (LIFO) sorting based on createdAt date
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

  // Optional: Prevent rendering if there is no data to show yet
  if (testimonials.length === 0) {
      return null; 
  }

  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: isMobile
          ? "30px 10px 60px"    // Extra bottom padding added
          : isTablet
          ? "40px 20px 70px"    // Extra bottom padding for tablet
          : "60px 0 80px",      // Extra bottom padding for desktop
        backgroundColor: "#F3F4F6",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      {/* Section Heading */}
      <h3
        style={{
          fontFamily: "'Montserrat', sans-serif",
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
          fontFamily: "'Montserrat', sans-serif",
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
          paddingBottom: isMobile ? "40px" : "50px", // Bottom space for Swiper
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
                flexDirection: isMobile ? "column" : "row",
                alignItems: "stretch", // Stretches image container to full card height on desktop
                textAlign: isMobile ? "center" : "left",
                height: "100%",
              }}
            >
              {/* Image */}
              <div
                style={{
                  flex: isMobile ? "none" : "0 0 45%",
                  width: isMobile ? "100%" : "auto",
                  height: isMobile ? "250px" : "auto", // Auto height lets it stretch to fit text container on desktop
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Change to "contain" if you don't want any image cropping
                    display: "block",   // Prevents default inline bottom margin
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
                  justifyContent: "center", // Vertically centers text beside the image
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    fontFamily: "'Montserrat', sans-serif",
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
                <p
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#444",
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;