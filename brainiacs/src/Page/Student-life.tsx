import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Rellax from "rellax";

const Studentlife: React.FC = () => {
  const events = [
    {
      title: "Uni Sittham",
      date: "August 30, 2025",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/uni-siththam-lyceum-campus-11.webp",
    },
    {
      title: "Paduru Party 2024",
      date: "April 8, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/5Usk2HCIqbE5x77lg8q3uDu1191m54NY0TTuwL15.webp",
    },
    {
      title: "Ravi Ru 2024",
      date: "April 22, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/juVB2SDRZ1n7ZtSDquOr3dcVlewhkNFgSfpa4vFD.jpg",
    },
    {
      title: "Iftar Celebration",
      date: "March 23, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/iftar-celebration-2024-lyceum-campus-8.webp",
    },
    {
      title: "New Student Council Installation",
      date: "March 15, 2024",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/new-student-council-installation-lyceum-campus-1.webp",
    },
    {
      title: "Felize Night 22",
      date: "December 9, 2022",
      image:
        "https://lyc-website-bucket.s3.ap-southeast-1.amazonaws.com/events/felize-night-22-lyceum-campus-3.webp",
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
      new Rellax(circleRef.current, {
        speed: -3,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false,
      });
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
      backgroundColor: "#cce4ff",
      zIndex: 0,
    },
    container: {
      position: "relative" as const,
      backgroundColor: "#fff",
      padding: "50px 5%",
      textAlign: "center" as const,
      fontFamily: "'Poppins', sans-serif",
      zIndex: 1,
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#111827",
      marginBottom: "0.5rem",
      fontFamily: "'Montserrat', sans-serif",
    },
    subtitle: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#4b5563",
      marginBottom: "2.5rem",
      fontFamily: "'Montserrat', sans-serif",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "30px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    card: {
      backgroundColor: "#2d2d2d",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    image: {
      width: "100%",
      height: "220px",
      objectFit: "cover" as const,
      display: "block",
    },
    info: {
      backgroundColor: "#1f2937",
      padding: "15px",
      color: "#fff",
      textAlign: "left" as const,
      fontFamily: "'Montserrat', sans-serif",
    },
    eventName: {
      fontSize: "1rem",
      fontWeight: 600,
      margin: "0 0 5px 0",
      fontFamily: "'Montserrat', sans-serif",
    },
    date: {
      fontSize: "0.9rem",
      color: "#d1d5db",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontFamily: "'Montserrat', sans-serif",
    },
    pagination: {
      marginTop: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    pageButton: {
      backgroundColor: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.9rem",
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
      width: "40px",
      height: "40px",
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
      {/* Parallax Background Circle */}
      <div ref={circleRef} style={styles.backgroundCircle}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>Student Life of Lyceum Campus</h1>
        <h2 style={styles.subtitle}>Past Events</h2>

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
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }}
              >
                <img src={event.image} alt={event.title} style={styles.image} />
                <div style={styles.info}>
                  <h3 style={styles.eventName}>{event.title}</h3>
                  <p style={styles.date}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {event.date}
                  </p>
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

export default Studentlife;
