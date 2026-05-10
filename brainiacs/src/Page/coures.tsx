import React from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const Coures: React.FC = () => {
  return (
    <>
      {/* Header Banner with Text & Inquire Button */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "280px", md: "420px" },
          overflow: "hidden",
          background: "#F5F5F4",
        }}
      >
        <Box
          component="img"
          src="https://i.ibb.co/m5WnyvxK/Gemini-Generated-Image-yeqnwvyeqnwvyeqn.png"
          alt="Foundation in Business Program Banner"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Left-side Text and Button */}
        <Box
          sx={{
            position: "absolute",
            top: { xs: "48%", md: "60%" },
            left: { xs: "5%", md: "7%" },
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              color: "#00cc99",
              fontWeight: 700,
              fontSize: { xs: "18px", sm: "24px", md: "32px" },
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
            }}
          >
            Foundation in
          </Typography>

          <Typography
            sx={{
              color: "#0a5397",
              fontWeight: 700,
              fontSize: { xs: "24px", sm: "30px", md: "42px" },
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
            }}
          >
            Business Programs
          </Typography>

          <Button
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#1b3b84",
              color: "#fff",
              px: { xs: 3, md: 4 },
              py: { xs: 1, md: 1.5 },
              borderRadius: "30px",
              fontWeight: 600,
              fontSize: { xs: "14px", md: "16px" },
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#162e6b",
              },
            }}
          >
            Inquire Here
          </Button>
        </Box>
      </Box>

      {/* Breadcrumb Section */}
      <Box
        sx={{
          bgcolor: "#F1F5F9",
          fontFamily: "'Montserrat', sans-serif",
          py: 2,
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
              fontSize: { xs: "14px", md: "16px" },
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
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Course
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      {/* Program Information Section */}
      <Box sx={{ width: "100%", mt: 6, mb: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            p: { xs: 3, md: 6 },
            boxShadow: 8,
            borderRadius: 5,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <CardContent sx={{ pb: 0 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                mb: 3,
                fontSize: { xs: "24px", md: "32px" },
              }}
            >
              Lyceum Global Foundation in Business
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 2,
                fontSize: { xs: "15px", md: "16px" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              The Lyceum Global Foundation in Business program offered at Lyceum
              Campus is an internationally recognized and dynamic pre-university
              qualification designed to prepare students for higher education in
              the field of Business & Management.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "15px", md: "16px" },
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              This program is specifically tailored for students who have
              completed their O/Ls, offering them a fast-track route to pursue a
              degree or for students who did not achieve their expected A/L
              results, providing them with an alternative and efficient pathway
              to enter a degree program in Business & Management and related
              disciplines.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Details Section */}
      <Box sx={{ width: "100%", mt: 0, mb: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            p: { xs: 3, md: 6 },
            boxShadow: 8,
            borderRadius: 5,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <CardContent>
            <List sx={{ mt: 4 }}>
              {[
                { title: "Duration", content: "08 Months" },
                { title: "Intakes", content: "March & September" },
                {
                  title: "Entry Requirement",
                  content: (
                    <Typography
                      component="div"
                      sx={{
                        mt: 0.5,
                        ml: 2,
                        lineHeight: 1.6,
                        fontWeight: 400,
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      National/Cambridge O/Level: 4 C passes, including English &
                      a pass in Mathematics
                      <br />
                      Edexcel O/Level: 16 points, including English and
                      Mathematics
                    </Typography>
                  ),
                },
                {
                  title: "Progression",
                  content: (
                    <Typography
                      component="div"
                      sx={{
                        mt: 0.5,
                        ml: 2,
                        lineHeight: 1.6,
                        fontWeight: 400,
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      Gain direct entry into the first year of a bachelor’s
                      degree at our partner universities in Australia, the UK,
                      New Zealand, Malaysia or Sri Lanka
                    </Typography>
                  ),
                },
                { title: "Awarding Body", content: "Lyceum Campus" },
                {
                  title: "Scholarships",
                  content: (
                    <Typography
                      component="span"
                      sx={{
                        ml: 1,
                        lineHeight: 1.6,
                        fontWeight: 400,
                        fontFamily: '"Montserrat", sans-serif',
                      }}
                    >
                      Up To 50%{" "}
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
                <ListItem key={index} sx={{ alignItems: "flex-start" }}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        backgroundColor: "#1E4CA1",
                        borderRadius: "50%",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 0.5,
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "white", fontSize: 18 }} />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          lineHeight: 1.5,
                          fontFamily: '"Montserrat", sans-serif',
                        }}
                      >
                        {item.title} :
                        {typeof item.content === "string" ? (
                          <Typography
                            component="span"
                            sx={{
                              fontWeight: 400,
                              ml: 1,
                              lineHeight: 1.6,
                              fontFamily: '"Montserrat", sans-serif',
                            }}
                          >
                            {item.content}
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

      {/* Modules Section */}
      <Box
        sx={{
          width: "100%",
          position: "relative",
          py: { xs: 5, md: 8 },
          px: { xs: 3, md: 6 },
          pb: { xs: 10, sm: 12, md: 14 },
          overflow: "hidden",
          color: "white",
          backgroundImage:
            'url("https://lyceumcampus.lk/assets/website/programs/global/Business-Career-Opportunities.jpg")',
          backgroundSize: { xs: "contain", md: "100% auto" },
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0a204d",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            maxWidth: "1000px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-start" },
            justifyContent: "center",
            gap: 4,
            textShadow: "0px 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 3,
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Modules
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {[
              "Academic English",
              "Essentials Of Computing",
              "Mathematics I",
              "Professional Communication",
              "Understanding Organizations",
              "Introduction To Economics",
              "Principles Of Marketing",
              "Introduction To Accounting",
            ].map((module, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 1.5,
                  py: 0.8,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "white",
                    color: "#1E4CA1",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  ›
                </Box>
                <Typography
                  sx={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: { xs: "15px", md: "16px" },
                  }}
                >
                  {module}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom Same Design Section */}
<Box
  sx={{
    width: "100%",
    position: "relative",
    py: { xs: 6, md: 10 },
    px: { xs: 2, md: 4 },
    backgroundColor: "#f9fafd",
    display: "flex",
    justifyContent: "center",
  }}
>
  <Box
    sx={{
      backgroundColor: "white",
      borderRadius: "30px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      width: "100%",
      maxWidth: "1400px",
      p: { xs: 4, sm: 6, md: 8 },
    }}
  >
    <Typography
      variant="h5" // smaller heading
      sx={{
        fontWeight: "bold",
        mb: 6,
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
        gap: 3,
      }}
    >
      {[
        "Business Analyst",
        "Marketing Executive",
        "Human Resource Assistant",
        "Entrepreneurship Pathway",
        "Financial Assistant",
        "Customer Relations Executive",
        "Operations Coordinator",
        "Sales & Marketing Consultant",
      ].map((career, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "#f2f6fb",
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.05)",
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
              fontSize: { xs: "12px", md: "13px" }, // smaller font size
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
              fontSize: "18px", // smaller arrow
            }}
          ></i>
        </Box>
      ))}
    </Box>
  </Box>
</Box>




    </>
  );
};

export default Coures;
