/**
 * ============================================================================
 * COMPONENT: Login.tsx
 * PROJECT: Digi Laser Real Estate Admin Portal
 * DESIGN: Corporate Modern (Teal & Gold)
 * FONT: Montserrat
 * ============================================================================
 */

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

// Material UI Components
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Collapse,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  CssBaseline,
  Tooltip,
  Zoom
} from "@mui/material";

// Material UI Icons
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  PersonOutline,
  ShieldOutlined,
  ArrowBack,
  InfoOutlined,
  AdminPanelSettings,
  Language,
  VerifiedUser,
  SupportAgent
} from "@mui/icons-material";

// ----------------------------------------------------------------------------
// TYPES & INTERFACES
// ----------------------------------------------------------------------------
interface LoginResponse {
  token: string;
  requires2FA: boolean;
  adminId: string;
  admin: {
    name: string;
    email: string;
    role: string;
  };
}

interface ApiError {
  message: string;
}

// ----------------------------------------------------------------------------
// STYLED CONSTANTS
// ----------------------------------------------------------------------------
const PRIMARY_TEAL = "#004652";
const ACCENT_GOLD = "#CC9D2F";
const BG_LIGHT = "#F8FAFC";
const MONTSERRAT = "'Montserrat', sans-serif";
const LOGO_URL = "https://i.ibb.co/6RkH7J3r/Small-scaled.webp";

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------
const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Flow State
  const [step, setStep] = useState<"password" | "otp">("password");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Data State
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [adminId, setAdminId] = useState<string>("");

  // UI Feedback State
  const [error, setError] = useState<string | null>(null);
  const [showForgotAlert, setShowForgotAlert] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Initial UI Setup
    document.title = "Login | Digi Laser Real Estate";
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Check existing session
    const token = localStorage.getItem("token");
    if (token) {
      const savedAdmin = localStorage.getItem("adminData");
      console.log("Session detected for:", savedAdmin ? JSON.parse(savedAdmin).name : "Admin");
      navigate("/dashboard");
    }
  }, [navigate]);

  // --------------------------------------------------------------------------
  // LOGIC HANDLERS
  // --------------------------------------------------------------------------
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const clearMessages = () => {
    setError(null);
    setShowForgotAlert(false);
  };

  /**
   * Step 1: Handle Email/Password Submission
   */
  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post<LoginResponse>(`${BASE_URL}/api/login`, {
        email: email.trim(),
        password
      });

      if (response.data.requires2FA) {
        setAdminId(response.data.adminId);
        setStep("otp");
      } else {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data.admin));
        navigate("/dashboard");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(axiosError.response?.data?.message || "Internal server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Handle 2FA Verification
   */
  const handleTwoFactorVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (otp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    const BASE_URL = import.meta.env.VITE_API_URL;

    try {
      const response = await axios.post(`${BASE_URL}/api/verify-2fa`, {
        adminId,
        token: otp
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("adminData", JSON.stringify(response.data.admin));
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Invalid security code. Please check your authenticator app.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // MEMOIZED STYLES
  // --------------------------------------------------------------------------
  const inputGlobalStyles = useMemo(() => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 4,
      backgroundColor: BG_LIGHT,
      fontFamily: MONTSERRAT,
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "#F1F5F9",
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": {
          borderColor: PRIMARY_TEAL,
          borderWidth: "2px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      fontFamily: MONTSERRAT,
      fontWeight: 600,
      color: "#94A3B8",
      "&.Mui-focused": {
        color: PRIMARY_TEAL,
      },
    },
  }), []);

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)`,
        position: "relative",
        overflow: "hidden"
      }}
    >
      <CssBaseline />
      
      {/* Background Decorative Elements */}
      <Box sx={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${PRIMARY_TEAL}08 0%, transparent 70%)`,
        top: "-200px",
        right: "-100px",
        zIndex: 0
      }} />

      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Fade in={true} timeout={1200}>
          <Paper
            elevation={0}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              p: { xs: 4, md: 7 },
              borderRadius: 12,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: isHovered 
                ? "0 50px 100px -20px rgba(0, 42, 50, 0.18)" 
                : "0 30px 60px -12px rgba(0, 42, 50, 0.12)",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              textAlign: "center"
            }}
          >
            {/* Logo Section */}
            <Box sx={{ mb: 5 }}>
              <Box
                component="img"
                src={LOGO_URL}
                alt="Digi Laser Logo"
                sx={{
                  height: { xs: 70, md: 90 },
                  width: "auto",
                  mb: 3,
                  filter: "drop-shadow(0 8px 15px rgba(0,0,0,0.08))"
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontFamily: MONTSERRAT,
                  fontWeight: 800,
                  color: PRIMARY_TEAL,
                  letterSpacing: "-1.5px",
                  textTransform: "uppercase"
                }}
              >
                {step === "password" ? "Admin Login" : "Identity Shield"}
              </Typography>
              <Box sx={{ 
                width: 60, 
                height: 4, 
                bgcolor: ACCENT_GOLD, 
                margin: "12px auto", 
                borderRadius: 2 
              }} />
            </Box>

            {/* Error/Notice Handlers */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Collapse in={!!error}>
                <Alert
                  severity="error"
                  variant="filled"
                  icon={<ShieldOutlined />}
                  onClose={() => setError(null)}
                  sx={{
                    borderRadius: 3,
                    fontFamily: MONTSERRAT,
                    fontWeight: 600,
                    boxShadow: "0 8px 20px rgba(211, 47, 47, 0.2)"
                  }}
                >
                  {error}
                </Alert>
              </Collapse>

              <Collapse in={showForgotAlert}>
                <Alert
                  severity="info"
                  variant="outlined"
                  icon={<SupportAgent />}
                  onClose={() => setShowForgotAlert(false)}
                  sx={{
                    borderRadius: 3,
                    fontFamily: MONTSERRAT,
                    fontWeight: 500,
                    borderColor: PRIMARY_TEAL,
                    color: PRIMARY_TEAL,
                    textAlign: "left"
                  }}
                >
                  Password resets are restricted. Please contact your Department Head or the IT Security Team.
                </Alert>
              </Collapse>
            </Stack>

            {/* Form Section */}
            <Box
              component="form"
              onSubmit={step === "password" ? handleInitialLogin : handleTwoFactorVerify}
              noValidate
            >
              {step === "password" ? (
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Authorized Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ color: PRIMARY_TEAL }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={inputGlobalStyles}
                  />

                  <TextField
                    fullWidth
                    label="Secure Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: PRIMARY_TEAL }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={inputGlobalStyles}
                  />

                  <Box sx={{ textAlign: "right", mt: -1 }}>
                    <Tooltip title="Contact IT for help" arrow TransitionComponent={Zoom}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowForgotAlert(true)}
                        sx={{
                          fontFamily: MONTSERRAT,
                          color: ACCENT_GOLD,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          "&:hover": { backgroundColor: "transparent", color: PRIMARY_TEAL }
                        }}
                      >
                        Trouble accessing your account?
                      </Button>
                    </Tooltip>
                  </Box>
                </Stack>
              ) : (
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: MONTSERRAT,
                      color: "#64748B",
                      mb: 4,
                      fontWeight: 500
                    }}
                  >
                    Enter the 6-digit code from your <Box component="span" sx={{ color: PRIMARY_TEAL, fontWeight: 700 }}>Google Authenticator</Box>
                  </Typography>
                  
                  <TextField
                    fullWidth
                    placeholder="0 0 0 0 0 0"
                    variant="outlined"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    inputProps={{
                      maxLength: 6,
                      style: {
                        textAlign: "center",
                        fontSize: isMobile ? "1.8rem" : "2.5rem",
                        letterSpacing: isMobile ? "10px" : "15px",
                        fontWeight: 900,
                        fontFamily: MONTSERRAT,
                        color: PRIMARY_TEAL
                      }
                    }}
                    sx={inputGlobalStyles}
                  />
                </Box>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 5,
                  py: 2.2,
                  borderRadius: 5,
                  backgroundColor: PRIMARY_TEAL,
                  fontFamily: MONTSERRAT,
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "1.5px",
                  boxShadow: `0 12px 25px ${PRIMARY_TEAL}40`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#00323a",
                    transform: "translateY(-3px)",
                    boxShadow: `0 15px 35px ${PRIMARY_TEAL}60`,
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#94A3B8",
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#FFF" }} />
                ) : (
                  step === "password" ? "VALIDATE & CONTINUE" : "CONFIRM ACCESS"
                )}
              </Button>

              {step === "otp" && (
                <Button
                  fullWidth
                  startIcon={<ArrowBack />}
                  onClick={() => setStep("password")}
                  sx={{
                    mt: 3,
                    color: "#64748B",
                    fontFamily: MONTSERRAT,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { backgroundColor: "transparent", color: PRIMARY_TEAL }
                  }}
                >
                  Use a different account
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AdminPanelSettings sx={{ color: "#CBD5E1", fontSize: 18 }} />
                <Typography variant="caption" sx={{ color: "#94A3B8", fontWeight: 700, letterSpacing: 1.5 }}>
                  SECURED BY DIGI LASER
                </Typography>
              </Stack>
            </Divider>

            {/* Footer Info */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <VerifiedUser sx={{ fontSize: 14, color: "#10B981" }} />
                <Typography variant="caption" sx={{ color: "#64748B", fontFamily: MONTSERRAT }}>
                  SSL Encrypted
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: "#64748B", fontFamily: MONTSERRAT, display: { xs: 'none', sm: 'block' } }}>
                •
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", fontFamily: MONTSERRAT }}>
                Internal Use Only
              </Typography>
            </Stack>
          </Paper>
        </Fade>

        {/* System Footer */}
        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between", px: 2, opacity: 0.7 }}>
          <Typography variant="caption" sx={{ fontFamily: MONTSERRAT, fontWeight: 700, color: "#475569" }}>
            DIGI LASER v4.2.0
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: MONTSERRAT, fontWeight: 700, color: "#475569" }}>
            &copy; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;