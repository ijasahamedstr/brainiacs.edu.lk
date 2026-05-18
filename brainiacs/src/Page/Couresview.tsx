import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// TypeScript interfaces based on your Mongoose schema
interface ModuleRow {
  code: string;
  name: string;
  credits: string;
}

interface Semester {
  id?: string;
  semesterName: string;
  moduleRows: ModuleRow[];
}

interface EntryRequirement {
  category: string;
  descriptions: string[];
}

interface CourseData {
  _id: string;
  courseName: string;
  courseCategory: string;
  isCampusOffering: boolean;
  courseDescription: string[];
  duration: string;
  intake: string;
  awardingBody: string;
  entryRequirements: EntryRequirement[];
  progression: string;
  scholarships: string;
  semesters: Semester[];
  careerPathways: string[];
  coverImage: string;
  images: string[];
}

const Coures_view: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/course/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course details");
        }
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10, minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !course) {
    return (
      <Box sx={{ textAlign: "center", mt: 10, minHeight: "50vh", color: "red" }}>
        <Typography variant="h6" sx={{ fontSize: "16px" }}>Error loading course: {error || "Not found"}</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Header Banner with Text */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "220px", md: "320px" },
          overflow: "hidden",
          background: "#F5F5F4",
        }}
      >
        <Box
          component="img"
          src={course.coverImage || "https://i.ibb.co/m5WnyvxK/Gemini-Generated-Image-yeqnwvyeqnwvyeqn.png"}
          alt={course.courseName}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            fontFamily: '"Montserrat", sans-serif',
          }}
        />

        {/* Left-side Text */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "50%", md: "55%" },
            left: { xs: "5%", md: "7%" },
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
            backgroundColor: "rgba(255, 255, 255, 0.85)", 
            p: 2.5,
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              color: "#00cc99",
              fontWeight: 700,
              fontSize: { xs: "14px", sm: "16px", md: "20px" },
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
            }}
          >
            {course.courseCategory}
          </Typography>

          <Typography
            sx={{
              color: "#0a5397",
              fontWeight: 700,
              fontSize: { xs: "20px", sm: "24px", md: "32px" },
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
              
            }}
          >
            {course.courseName}
          </Typography>
        </Box>
      </Box>

      {/* Breadcrumb Section */}
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          fontFamily: "'Montserrat', sans-serif",
          py: 1.5,
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "1300px",
            mx: "auto",
          }}
        >
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              fontWeight: 500,
            }}
          >
            <Link
              underline="hover"
              color="inherit"
              href="/"
              sx={{
                color: "#1E293B",
                fontFamily: "'Montserrat', sans-serif",
                "&:hover": { color: "#0F172A" },
              }}
            >
              Home
            </Link>
            <Typography
              sx={{
                color: "#0F172A",
                fontWeight: 600,
                fontSize: { xs: "12px", md: "13px" },
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {course.courseName}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Program Information Section */}
      <Box sx={{ width: "100%", mt: 4, mb: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            p: { xs: 2, md: 4 },
            boxShadow: 4,
            borderRadius: 3,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "18px", md: "22px" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {course.courseName} Overview
            </Typography>

            {course.courseDescription.map((desc, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  mb: 1.5,
                  fontSize: { xs: "13px", md: "14px" },
                  fontFamily: '"Montserrat", sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </Box>

      {/* Details Section */}
      <Box sx={{ width: "100%", mt: 0, mb: { xs: 3, md: 4 }, px: { xs: 2, md: 4 } }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            p: { xs: 2, md: 4 },
            boxShadow: 4,
            borderRadius: 3,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <CardContent>
            <List sx={{ mt: 1 }}>
              {[
                { title: "Duration", content: course.duration },
                { title: "Intakes", content: course.intake },
                {
                  title: "Entry Requirement",
                  content: (
                    <Box sx={{ mt: 0.5, ml: 1.5 }}>
                      {course.entryRequirements.map((req, idx) => (
                        <Box key={idx} sx={{ mb: 1.5 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "13px", md: "14px" },
                              fontFamily: '"Montserrat", sans-serif',
                              color: "#1b3b84",
                            }}
                          >
                            {req.category}
                          </Typography>
                          <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                            {req.descriptions.map((desc, dIdx) => (
                              <Typography
                                component="li"
                                key={dIdx}
                                sx={{
                                  lineHeight: 1.5,
                                  fontSize: { xs: "13px", md: "14px" },
                                  fontWeight: 400,
                                  fontFamily: '"Montserrat", sans-serif',
                                }}
                              >
                                {desc}
                              </Typography>
                            ))}
                          </ul>
                        </Box>
                      ))}
                    </Box>
                  ),
                },
                { title: "Progression", content: course.progression },
                { title: "Awarding Body", content: course.awardingBody },
                {
                  title: "Scholarships",
                  content: (
                    <Typography
                      component="span"
                      sx={{
                        ml: 1,
                        lineHeight: 1.5,
                        fontSize: { xs: "13px", md: "14px" },
                        fontWeight: 400,
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      {course.scholarships}{" "}
                      <Link
                        href="#"
                        sx={{
                          textDecoration: "none",
                          color: "#1E4CA1",
                          fontWeight: 500,
                        }}
                      >
                        (Conditions Apply)
                      </Link>
                    </Typography>
                  ),
                },
              ].map((item, index) => (
                <ListItem key={index} sx={{ alignItems: "flex-start", py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: "36px" }}>
                    <Box
                      sx={{
                        backgroundColor: "#1E4CA1",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.2,
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "white", fontSize: 14 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          lineHeight: 1.5,
                          fontSize: { xs: "13px", md: "14px" },
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        {item.title} :
                        {typeof item.content === "string" ? (
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              fontSize: { xs: "13px", md: "14px" },
                              ml: 1,
                              lineHeight: 1.5,
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            {item.content || "N/A"}
                          </Typography>
                        ) : (
                          item.content
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Modules (Semesters) Section */}
      {course.semesters && course.semesters.length > 0 && (
        <Box
          sx={{
            width: "100%",
            position: "relative",
            py: { xs: 4, md: 6 },
            px: { xs: 3, md: 6 },
            pb: { xs: 6, sm: 8, md: 10 },
            overflow: "hidden",
            color: "white",
            backgroundImage:
              'url("https://lyceumcampus.lk/assets/website/programs/global/Business-Career-Opportunities.jpg")',
            backgroundSize: { xs: "cover", md: "100% auto" },
            backgroundRepeat: "no-repeat",
            backgroundColor: "#0a204d",
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              maxWidth: "1200px",
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              textShadow: "0px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "20px", md: "24px" },
                fontFamily: '"Montserrat", sans-serif',
                textAlign: "center",
              }}
            >
              Course Modules
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {course.semesters.map((sem, sIdx) => (
                <Box key={sIdx}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1.5,
                      fontSize: { xs: "15px", md: "16px" },
                      fontFamily: '"Montserrat", sans-serif',
                      color: "#00cc99",
                      borderBottom: "2px solid #00cc99",
                      display: "inline-block",
                      pb: 0.5,
                    }}
                  >
                    {sem.semesterName}
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
                      gap: 1.5,
                    }}
                  >
                    {sem.moduleRows.map((mod, mIdx) => (
                      <Box
                        key={mIdx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          px: 1.5,
                          py: 0.8,
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "white",
                            color: "#1E4CA1",
                            borderRadius: "50%",
                            width: 16,
                            height: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: 12,
                            flexShrink: 0,
                            mt: 0.3,
                          }}
                        >
                          ›
                        </Box>
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: '"Montserrat", sans-serif',
                              fontSize: { xs: "12px", md: "13px" },
                              fontWeight: 600,
                              lineHeight: 1.3,
                            }}
                          >
                            {mod.name}
                          </Typography>
                          {(mod.code || mod.credits) && (
                            <Typography
                              sx={{
                                fontFamily: '"Montserrat", sans-serif',
                                fontSize: "10px",
                                color: "#ccc",
                                mt: 0.2,
                              }}
                            >
                              {mod.code && `Code: ${mod.code} `}
                              {mod.credits && `| Credits: ${mod.credits}`}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Career Opportunities Section */}
      {course.careerPathways && course.careerPathways.length > 0 && (
        <Box
          sx={{
            width: "100%",
            position: "relative",
            py: { xs: 4, md: 6 },
            px: { xs: 2, md: 4 },
            backgroundColor: "#f9fafd",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
              width: "100%",
              maxWidth: "1400px",
              p: { xs: 3, sm: 4, md: 6 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 4,
                fontSize: { xs: "18px", md: "22px" },
                fontFamily: '"Montserrat", sans-serif',
                color: "#1E4CA1",
                textAlign: "center",
              }}
            >
              Career Opportunities
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {course.careerPathways.map((career, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#f2f6fb",
                    borderRadius: "20px",
                    px: 2.5,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "inset 0 0 4px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e8f0fc",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Montserrat", sans-serif',
                      fontSize: { xs: "11px", md: "12px" },
                      color: "#1e1e1e",
                      fontWeight: 500,
                    }}
                  >
                    {career}
                  </Typography>

                  <i
                    className="uil uil-angle-right"
                    style={{
                      color: "#1E4CA1",
                      fontSize: "14px",
                    }}
                  ></i>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Coures_view;