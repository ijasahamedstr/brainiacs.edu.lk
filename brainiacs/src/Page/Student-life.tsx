import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Rellax from "rellax";
import { Box, Typography } from "@mui/material";

interface StudentLifeEvent {
  _id: string;
  name: string;
  descriptions: string[];
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

const Studentlife: React.FC = () => {
  const [events, setEvents] = useState<StudentLifeEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch data from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/api/student-life`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch student life events");
        }
        
        const data = await response.json();
        setEvents(data.data || data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Rellax setup
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (circleRef.current && !isLoading && window.innerWidth > 768) {
      new Rellax(circleRef.current, {
        speed: -3,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false,
      });
    }
  }, [isLoading]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Fluid & Fully Responsive Styles
  const styles = {
    sectionWrapper: {
      position: "relative" as const,
      overflow: "hidden",
      zIndex: 1,
      width: "100%",
    },
    backgroundCircle: {
      position: "absolute" as const,
      top: "-120px",
      left: "-120px",
      width: "clamp(300px, 30vw, 600px)",
      height: "clamp(300px, 30vw, 600px)",
      borderRadius: "50%",
      backgroundColor: "#cce4ff",
      zIndex: 0,
    },
    container: {
      position: "relative" as const,
      backgroundColor: "transparent",
      padding: "25px clamp(5%, 8vw, 10%) clamp(60px, 8vw, 100px)",
      textAlign: "center" as const,
      fontFamily: "'Poppins', sans-serif",
      zIndex: 1,
      minHeight: "60vh",
    },
    title: {
      fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
      fontWeight: 800,
      color: "#1E56A0", 
      marginBottom: "0.25rem",
      marginTop: "0",
      fontFamily: "'Montserrat', sans-serif",
      letterSpacing: "0.5px",
    },
    subtitle: {
      fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
      fontWeight: 600,
      color: "#7f8c8d",
      marginBottom: "clamp(2rem, 5vw, 3.5rem)",
      fontFamily: "'Montserrat', sans-serif",
      textTransform: "uppercase" as const,
      letterSpacing: "2px",
    },
    pagination: {
      marginTop: "clamp(50px, 8vw, 80px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "clamp(8px, 1.5vw, 15px)",
      flexWrap: "wrap" as const,
    },
    pageButton: {
      backgroundColor: "#fff",
      color: "#1E56A0",
      border: "1px solid #1E56A0",
      width: "clamp(35px, 4vw, 45px)",
      height: "clamp(35px, 4vw, 45px)",
      borderRadius: "8px", 
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "clamp(0.9rem, 1.2vw, 1rem)",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    activePage: {
      backgroundColor: "#1E56A0",
      color: "#fff",
    },
    statusMessage: {
      fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
      color: "#7f8c8d",
      padding: "40px 0",
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* Blue Header */}
      <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: { xs: 4, md: 8 },
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          position: "relative",
          zIndex: 2
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif',
            letterSpacing: "1px",
            fontSize: { xs: "2rem", md: "3rem" }
          }}
        >
        </Typography>
      </Box>

      <section style={styles.sectionWrapper}>
        <style>
          {`
            @keyframes popIn {
              0% { opacity: 0; transform: translateY(50px) scale(0.9); }
              70% { transform: translateY(-10px) scale(1.02); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            .event-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
              gap: 35px;
              max-width: 1400px;
              margin: 0 auto;
            }

            .animated-card {
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              border: 1px solid rgba(0,0,0,0.03);
              display: flex;
              flex-direction: column;
              height: 100%; 
              animation: popIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
              cursor: pointer;
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .animated-card:hover {
              transform: translateY(-12px) scale(1.02);
              box-shadow: 0 20px 40px rgba(30, 86, 160, 0.15); 
            }

            .card-image-wrapper {
              overflow: hidden;
              width: 100%;
              height: 250px; 
            }

            .event-image {
              width: 100%;
              height: 100%; 
              object-fit: cover;
              transition: transform 0.6s ease;
            }

            .animated-card:hover .event-image {
              transform: scale(1.08);
            }

            .event-info {
              padding: 20px 24px;
              text-align: left;
              display: flex;
              flex-direction: column;
              flex-grow: 1; 
              justify-content: flex-start;
              background: #fff;
              position: relative;
              z-index: 2;
            }

            .event-title {
              /* Reduced Title Font Size */
              font-size: clamp(0.95rem, 1.2vw, 1.1rem);
              font-weight: 700;
              color: #1a1a1a;
              margin: 0 0 10px 0;
              font-family: 'Montserrat', sans-serif;
              line-height: 1.4;
              transition: color 0.3s ease;
            }

            .animated-card:hover .event-title {
              color: #1E56A0; 
            }

            .event-date {
              /* Reduced Date Font Size */
              font-size: 0.8rem;
              color: #757575;
              display: flex;
              align-items: center;
              gap: 6px;
              font-family: 'Montserrat', sans-serif;
              font-weight: 600;
              margin-top: auto; 
            }
            
            .date-icon {
              color: #1E56A0;
            }
          `}
        </style>

        {/* Parallax Background Circle */}
        <div ref={circleRef} style={styles.backgroundCircle}></div>

        <div style={styles.container}>
          <h1 style={styles.title}>Brainiacs  Campus</h1>
          <h2 style={styles.subtitle}>Past Events</h2>

          {isLoading ? (
            <div style={styles.statusMessage}>Loading events...</div>
          ) : error ? (
            <div style={styles.statusMessage}>Error: {error}</div>
          ) : events.length === 0 ? (
            <div style={styles.statusMessage}>No events found.</div>
          ) : (
            <>
              <div className="event-grid">
                {currentEvents.map((event, index) => (
                  <Link
                    to={`/events/${event.name.replace(/\s+/g, "-").toLowerCase()}`}
                    key={event._id}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div 
                      className="animated-card"
                      style={{ animationDelay: `${index * 0.12}s` }} 
                    >
                      <div className="card-image-wrapper">
                        <img 
                          src={event.imageUrls[0] || "https://via.placeholder.com/600x400?text=No+Image"} 
                          alt={event.name} 
                          className="event-image"
                        />
                      </div>
                      <div className="event-info">
                        <h3 className="event-title">{event.name}</h3>
                        <p className="event-date">
                          {/* Reduced SVG icon size to match smaller text */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="date-icon"
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
                          {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === 1 ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
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
                      ...styles.pageButton,
                      ...(currentPage === totalPages ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
                    }}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Box>
  );
};

export default Studentlife;