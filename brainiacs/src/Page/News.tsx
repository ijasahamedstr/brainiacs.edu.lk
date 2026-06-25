import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Rellax from "rellax";
import { CircularProgress, Alert,Typography,Box } from "@mui/material";

interface NewsItem {
  _id: string;
  heading: string;
  slug: string;
  descriptionImage: string;
  descriptions: string[];
  createdAt: string;
}

const News: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;
  const indexOfLast = currentPage * newsPerPage;
  const indexOfFirst = indexOfLast - newsPerPage;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(newsList.length / newsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const baseUrl = API_BASE_URL?.replace(/\/$/, "") || "";
        const response = await fetch(`${baseUrl}/api/news`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }
        
        const data = await response.json();
        setNewsList(data.data || data); 
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Rellax setup
  const circleRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (circleRef.current && !isLoading && window.innerWidth > 768) {
      const rellax = new Rellax(circleRef.current, {
        speed: -3,
        center: false,
        round: true,
      });
      return () => rellax.destroy();
    }
  }, [isLoading]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Styles (Font sizes globally reduced)
  const styles = {
    sectionWrapper: {
      position: "relative" as const,
      overflow: "hidden",
      zIndex: 1,
      minHeight: "100vh",
      backgroundColor: "#fafafa",
      fontFamily: '"Montserrat", sans-serif' // Global font application
    },
    backgroundCircle: {
      position: "absolute" as const,
      top: "-120px",
      left: "-120px",
      width: "clamp(300px, 30vw, 600px)",
      height: "clamp(300px, 30vw, 600px)",
      borderRadius: "50%",
      backgroundColor: "#e3f2fd",
      zIndex: 0,
    },
    container: {
      position: "relative" as const,
      padding: "clamp(50px, 8vw, 100px) clamp(5%, 8vw, 10%) clamp(60px, 8vw, 100px)",
      textAlign: "center" as const,
      zIndex: 1,
    },
    title: {
      fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", // Reduced
      fontWeight: 800,
      color: "#1E56A0",
      marginBottom: "0.5rem",
      fontFamily: '"Montserrat", sans-serif',
      letterSpacing: "0.5px"
    },
    subtitle: {
      fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)", // Reduced
      fontWeight: 600,
      color: "#4b5563",
      marginBottom: "clamp(2.5rem, 5vw, 4rem)",
      fontFamily: '"Montserrat", sans-serif',
      letterSpacing: "1px",
      textTransform: "uppercase" as const,
    },
    pagination: {
      marginTop: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    pageButton: {
      backgroundColor: "#fff",
      color: "#1E56A0",
      border: "1px solid #1E56A0",
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: "0.9rem", // Reduced
      fontFamily: '"Montserrat", sans-serif',
      transition: "all 0.3s ease",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    activePage: {
      backgroundColor: "#1E56A0",
      color: "#fff",
    },
    disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    statusMessage: {
      fontSize: "1rem", // Reduced
      color: "#7f8c8d",
      padding: "40px 0",
      fontFamily: '"Montserrat", sans-serif',
    }
  };

  return (
    <>
    <Box
        sx={{
          backgroundColor: "#1E56A0",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: "bold",
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
        </Typography>
      </Box>
       <section style={styles.sectionWrapper}>
      <style>
        {`
          @keyframes popIn {
            0% { opacity: 0; transform: translateY(40px) scale(0.95); }
            70% { transform: translateY(-5px) scale(1.01); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }

          .news-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            max-width: 1240px;
            margin: 0 auto;
            align-items: stretch;
          }

          .animated-card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.05);
            border: 1px solid rgba(0,0,0,0.03);
            display: flex;
            flex-direction: column;
            height: 100%; 
            animation: popIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: left;
            font-family: 'Montserrat', sans-serif;
          }

          .animated-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 16px 32px rgba(30, 86, 160, 0.12);
          }

          .card-image-wrapper {
            overflow: hidden;
            width: 100%;
            height: 200px;
          }

          .news-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .animated-card:hover .news-image {
            transform: scale(1.05);
          }

          .news-info {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
          }

          .news-title {
            font-size: clamp(1rem, 1.2vw, 1.15rem); /* Reduced */
            font-weight: 700;
            margin: 0 0 8px 0;
            color: #1a1a1a;
            font-family: 'Montserrat', sans-serif;
            line-height: 1.4;
            transition: color 0.3s ease;
          }

          .animated-card:hover .news-title {
            color: #1E56A0;
          }

          .news-date {
            font-size: 0.8rem; /* Reduced */
            color: #6b7280;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 600;
            font-family: 'Montserrat', sans-serif;
          }

          .news-desc {
            font-size: 0.9rem; /* Reduced */
            color: #4b5563;
            margin-bottom: 16px;
            line-height: 1.6;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-family: 'Montserrat', sans-serif;
          }

          .news-desc p, .news-desc h1, .news-desc h2, .news-desc h3 {
            margin: 0;
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
          }

          .read-more {
            font-size: 0.85rem; /* Reduced */
            color: #1E56A0;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-top: auto;
            transition: color 0.2s ease;
            font-family: 'Montserrat', sans-serif;
          }
          
          .animated-card:hover .read-more {
            color: #113a70;
            text-decoration: underline;
          }
        `}
      </style>

      <div ref={circleRef} style={styles.backgroundCircle}></div>

      <div style={styles.container}>
        <h1 style={styles.title}>Brainiacs Campus Recent News</h1>
        <h2 style={styles.subtitle}>Campus News & Highlights</h2>

        {isLoading ? (
          <div style={styles.statusMessage}><CircularProgress sx={{ color: "#1E56A0" }} /></div>
        ) : error ? (
          <div style={styles.statusMessage}><Alert severity="error" sx={{ fontFamily: '"Montserrat", sans-serif' }}>{error}</Alert></div>
        ) : newsList.length === 0 ? (
          <div style={styles.statusMessage}>No news currently listed.</div>
        ) : (
          <>
            <div className="news-grid">
              {currentNews.map((item, index) => (
                <Link
                  to={`/news/${item.slug}`}
                  key={item._id}
                  style={{ textDecoration: "none" }}
                >
                  <div 
                    className="animated-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="card-image-wrapper">
                      <img 
                        src={item.descriptionImage || "https://via.placeholder.com/600x400?text=No+Image"} 
                        alt={item.heading} 
                        className="news-image" 
                      />
                    </div>
                    <div className="news-info">
                      <div>
                        <h3 className="news-title">{item.heading}</h3>
                        <p className="news-date">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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
                          {formatDate(item.createdAt)}
                        </p>
                        
                        <div 
                          className="news-desc" 
                          dangerouslySetInnerHTML={{ 
                            __html: item.descriptions && item.descriptions[0] 
                                      ? item.descriptions[0] 
                                      : "Read more about this news update..." 
                          }} 
                        />
                      </div>
                      <span className="read-more">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{
                    ...styles.pageButton,
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
                    ...styles.pageButton,
                    ...(currentPage === totalPages ? styles.disabled : {}),
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
    </>
  );
};

export default News;