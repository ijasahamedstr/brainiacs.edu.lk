import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Rellax from "rellax";

const News: React.FC = () => {
  const events = [
    {
      title: "Uni Sittham nes",
      date: "August 30, 2025",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/uni-siththam-lyceum-campus-11.webp",
      description:
        "An inspiring cultural and academic showcase by Lyceum Campus students celebrating creativity and unity.",
    },
    {
      title: "Paduru Party 2024",
      date: "April 8, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/5Usk2HCIqbE5x77lg8q3uDu1191m54NY0TTuwL15.webp",
      description:
        "A traditional Sri Lankan music night filled with rhythm, laughter, and campus spirit.",
    },
    {
      title: "Ravi Ru 2024",
      date: "April 22, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/juVB2SDRZ1n7ZtSDquOr3dcVlewhkNFgSfpa4vFD.jpg",
      description:
        "An evening of elegance, showcasing performances and talents of Lyceum Campus students.",
    },
    {
      title: "Iftar Celebration",
      date: "March 23, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/iftar-celebration-2024-lyceum-campus-8.webp",
      description:
        "A heartwarming Iftar gathering that celebrated togetherness and cultural harmony.",
    },
    {
      title: "New Student Council Installation",
      date: "March 15, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/new-student-council-installation-lyceum-campus-1.webp",
      description:
        "A proud moment as new student leaders were sworn in to represent the Lyceum Campus community.",
    },
    {
      title: "Felize Night 22",
      date: "December 9, 2022",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/felize-night-22-lyceum-campus-3.webp",
      description:
        "An unforgettable night of music, laughter, and celebration marking the end of the year in style.",
    },
  ];

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const indexOfLast = currentPage * eventsPerPage;
  const indexOfFirst = indexOfLast - eventsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Rellax setup
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (circleRef.current) {
      const rellax = new Rellax(circleRef.current, {
        speed: -3,
        center: false,
        round: true,
      });
      return () => rellax.destroy();
    }
  }, []);

  // Styles
  const styles = {
    sectionWrapper: {
      position: "relative" as const,
      overflow: "hidden",
      zIndex: 1,
    },
    backgroundCircle: {
      position: "absolute" as const,
      top: "-120px",
      left: "-120px",
      width: "420px",
      height: "420px",
      borderRadius: "50%",
      backgroundColor: "#e3f2fd",
      zIndex: 0,
    },
    container: {
      position: "relative" as const,
      backgroundColor: "#fff",
      padding: "120px 5%", // INCREASED TOP/BOTTOM PADDING
      textAlign: "center" as const,
      fontFamily: "'Poppins', sans-serif",
      zIndex: 1,
    },
    title: {
      fontSize: "2.8rem",
      fontWeight: 700,
      color: "#111827",
      marginBottom: "1.5rem", // ADDED SPACE BELOW TITLE
      fontFamily: "'Montserrat', sans-serif",
    },
    subtitle: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#4b5563",
      marginBottom: "5rem", // LARGE SPACE BEFORE THE GRID
      fontFamily: "'Montserrat', sans-serif",
      letterSpacing: "1px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "35px",
      maxWidth: "1240px",
      margin: "0 auto",
      alignItems: "stretch",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
      textAlign: "left" as const,
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    image: {
      width: "100%",
      height: "220px",
      objectFit: "cover" as const,
      display: "block",
    },
    info: {
      padding: "24px",
      color: "#111827",
      fontFamily: "'Montserrat', sans-serif",
      flexGrow: 1,
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
    },
    textBlock: {
      flexGrow: 1,
    },
    eventName: {
      fontSize: "1.25rem",
      fontWeight: 700,
      margin: "0 0 10px 0",
      color: "#0a5397",
    },
    date: {
      fontSize: "0.9rem",
      color: "#6b7280",
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    description: {
      fontSize: "0.95rem",
      color: "#374151",
      marginBottom: "20px",
      lineHeight: 1.6,
    },
    readMore: {
      fontSize: "0.9rem",
      color: "#0a5397",
      fontWeight: 600,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      transition: "color 0.2s ease",
      marginTop: "auto",
    },
    pagination: {
      marginTop: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
    },
    pageButton: {
      backgroundColor: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.95rem",
      transition: "all 0.25s ease",
    },
    activePage: {
      backgroundColor: "#0a5397",
      color: "#fff",
      border: "1px solid #0a5397",
    },
    navButton: {
      backgroundColor: "#f3f4f6",
      color: "#111827",
      border: "none",
      borderRadius: "50%",
      width: "44px",
      height: "44px",
      cursor: "pointer",
      fontWeight: 600,
      transition: "all 0.25s ease",
    },
    disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  };

  return (
    <section style={styles.sectionWrapper}>
      <div ref={circleRef} style={styles.backgroundCircle}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>Lyceum Campus Recent News</h1>
        <h2 style={styles.subtitle}>Campus News & Highlights</h2>

        <div style={styles.grid}>
          {currentEvents.map((event, index) => (
            <Link
              to={`/events/${event.title.replace(/\s+/g, "-").toLowerCase()}`}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{ ...styles.card, cursor: "pointer" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 15px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "none";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                }}
              >
                <img src={event.image} alt={event.title} style={styles.image} />
                <div style={styles.info}>
                  <div style={styles.textBlock}>
                    <h3 style={styles.eventName}>{event.title}</h3>
                    <p style={styles.date}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {event.date}
                    </p>
                    <p style={styles.description}>{event.description}</p>
                  </div>
                  <span style={styles.readMore}>Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.navButton,
              ...(currentPage === 1 ? styles.disabled : {}),
            }}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              style={{
                ...styles.pageButton,
                ...(currentPage === i + 1 ? styles.activePage : {}),
              }}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            style={{
              ...styles.navButton,
              ...(currentPage === totalPages ? styles.disabled : {}),
            }}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;