// src/components/Testimonials.tsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface Testimonial {
  name: string;
  course: string;
  batch: string;
  message: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Michelle Selvaratnam",
    course: "Diploma in Early Childhood Development",
    batch: "Education MAY 2023 BATCH",
    message:
      "Lyceum Campus stands out for its excellent teaching quality and a highly qualified lecture panel. The practical experience allows students to apply their knowledge in real-world settings, enhancing our understanding of teaching methodologies.",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/testimonials/sanuldi-de-silva-deakin-pathway-programme-2022-september-batch-lyceum-campus.webp",
  },
  {
    name: "Yasas Weliwita",
    course: "Deakin Pathway Programme",
    batch: "Lyceum Campus",
    message:
      "My time at Lyceum Campus has prepared me well for my career in English Language Teaching. Their exceptional lecturers were passionate about imparting knowledge, which helped me build the confidence and skills I have today.",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/testimonials/yasas-weliwita-deakin-pathway-programme-lyceum-campus.webp",
  },
  {
    name: "Student Three",
    course: "Business Management",
    batch: "JAN 2023 BATCH",
    message:
      "The curriculum was practical and relevant. The lecturers inspired me to think critically and creatively about management challenges.",
    image:
      "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/home/testimonials/lihini-marian-chamishka-ratnayake-diploma-in-english-language-teaching-2022-november-batch-lyceum-campus.webp",
  },
];

const Testimonials: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        padding: isMobile
          ? "30px 10px 60px"    // ✅ Extra bottom padding added
          : isTablet
          ? "40px 20px 70px"    // ✅ Extra bottom padding for tablet
          : "60px 0 80px",      // ✅ Extra bottom padding for desktop
        backgroundColor: "#f8f9fc",
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
          paddingBottom: isMobile ? "40px" : "50px", // ✅ Bottom space for Swiper
          perspective: "100px",
        }}
      >
        {testimonials.map((item, index) => (
          <SwiperSlide
            key={index}
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
                alignItems: "center",
                textAlign: isMobile ? "center" : "left",
                height: "100%",
              }}
            >
              {/* Image */}
              <div
                style={{
                  flex: isMobile ? "0 0 auto" : "0 0 45%",
                  height: isMobile ? "200px" : "100%",
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
                  }}
                />
              </div>

              {/* Text Content */}
              <div
                style={{
                  flex: 1,
                  padding: isMobile ? "15px 20px" : "25px 30px",
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
                    marginBottom: "10px",
                  }}
                >
                  {item.batch}
                </p>
                <p
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#444",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {item.message}
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
