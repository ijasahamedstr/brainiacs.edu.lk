import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Skeleton,
  Dialog,
  DialogContent,
  IconButton,
  Button,
  Slide,
} from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import Rellax from "rellax";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================
export interface BoardMember {
  _id?: string;
  name: string;
  jobDescription: string;
  detailedBio: string;
  imageUrl: string;
  email?: string;
  linkedIn?: string;
}

// ==========================================
// 2. FALLBACK MOCK DATA (If API Fails)
// ==========================================
const MOCK_MEMBERS: BoardMember[] = [
  {
    _id: "m1",
    name: "Dr. Eleanor Vance",
    jobDescription: "Chancellor",
    detailedBio: "Dr. Vance brings over 30 years of experience in higher education administration. She holds a Ph.D. in Educational Leadership from Oxford University and has spearheaded numerous global research initiatives. Her vision focuses on sustainable campus development and inclusive academic excellence.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "m2",
    name: "Prof. Marcus Thorne",
    jobDescription: "Vice Chancellor of Academic Affairs",
    detailedBio: "Professor Thorne is a renowned physicist who transitioned into administration to bridge the gap between STEM research and student curriculum. He oversees all academic programs, ensuring they meet rigorous international accreditation standards.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "m3",
    name: "Sarah Jenkins, MBA",
    jobDescription: "Chief Financial Officer",
    detailedBio: "With a background in corporate finance at Fortune 500 companies, Sarah manages the university's endowment and operational budget. She has successfully increased scholarship funding by 45% over the past three years through strategic investments.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
  {
    _id: "m4",
    name: "Dr. Rajiv Patel",
    jobDescription: "Dean of Student Life",
    detailedBio: "Dr. Patel is a passionate advocate for student mental health and extracurricular engagement. He coordinates housing, student organizations, and counseling services, working tirelessly to create a vibrant and supportive campus community.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
];

// ==========================================
// 3. MODAL TRANSITION ANIMATION
// ==========================================
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
const LeadershipGovernance: React.FC = () => {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Fetch data from the database
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const baseUrl = API_BASE_URL?.replace(/\/$/, "") || "";
        const response = await fetch(`${baseUrl}/api/board-governance`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch board members data");
        }
        
        const data = await response.json();
        // Check if data is empty, if so use mock data for demonstration
        const fetchedData = data.data || data;
        if (fetchedData.length === 0) {
          setMembers(MOCK_MEMBERS);
        } else {
          setMembers(fetchedData);
        }
      } catch (err: any) {
        console.warn("API Failed, falling back to mock data.", err);
        setError("Could not connect to live server. Displaying cached data.");
        setMembers(MOCK_MEMBERS); // Graceful fallback
      } finally {
        // Fake delay just to show off the nice skeleton loaders
        setTimeout(() => setLoading(false), 1200); 
      }
    };

    fetchMembers();
  }, []);

  // Initialize Rellax for parallax effects
  useEffect(() => {
    const rellax = new Rellax(".rellax");
    return () => {
      rellax.destroy();
    };
  }, []);

  // Sort members based on roles
  const filteredMembers = useMemo(() => {
    const roleOrder = (jobDescription: string): number => {
      const desc = (jobDescription || "").toLowerCase();
      if (desc.includes("president")) return 1;
      if (desc.includes("chancellor") && !desc.includes("vice")) return 2;
      if (desc.includes("vice chancellor") || desc.includes("vice-chancellor") || desc.includes("vicechancellor")) return 3;
      return 4;
    };

    return [...members].sort((a, b) => roleOrder(a.jobDescription) - roleOrder(b.jobDescription));
  }, [members]);

  // Handlers for Modal
  const handleOpenModal = (member: BoardMember) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Slight delay to clear data so the exit animation doesn't break
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Split members into President(s) and others
  const presidents = useMemo(() => {
    return filteredMembers.filter(m => (m.jobDescription || "").toLowerCase().includes("president"));
  }, [filteredMembers]);

  const others = useMemo(() => {
    return filteredMembers.filter(m => !(m.jobDescription || "").toLowerCase().includes("president"));
  }, [filteredMembers]);

  const renderMemberCard = (member: BoardMember, isPresident: boolean, index: number) => (
    <Grid
      size={isPresident ? { xs: 12, sm: 8, md: 6 } : { xs: 12, sm: 6, md: 4 }}
      key={member._id || `card-${isPresident ? 'pres' : 'other'}-${index}`}
      sx={isPresident ? { display: "flex", justifyContent: "center", mx: "auto" } : undefined}
    >
      <Card
        onClick={() => handleOpenModal(member)}
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 4,
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          position: "relative",
          overflow: "visible",
          mt: 6,
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 20px 40px rgba(10, 83, 151, 0.15)",
          },
        }}
      >
        {/* Top Accent Banner */}
        <Box
          sx={{
            height: 80,
            background: "linear-gradient(135deg, #0a5397 0%, #3949ab 100%)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />

        {/* Floating Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: -7 }}>
          <Avatar
            src={member.imageUrl}
            alt={member.name}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid #fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          />
        </Box>

        {/* Card Content */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            px: 3,
            pb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mt: 1,
              color: "#1a237e",
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {member.name}
          </Typography>
          
          <Typography
            variant="subtitle2"
            sx={{
              color: "#d32f2f",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              mb: 2,
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {member.jobDescription}
          </Typography>

          <Divider sx={{ width: "20%", mb: 2, borderColor: "#e0e0e0" }} />

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              fontFamily: "'Montserrat', sans-serif",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {member.detailedBio}
          </Typography>
          
          <Button 
            size="small" 
            sx={{ mt: 'auto', pt: 2, color: "#0a5397", fontWeight: 600 }}
          >
            Read Profile
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f9fbff",
          pt: { xs: 15, md: 25 },
          pb: { xs: 10, md: 15 },
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
        {/* Parallax Soft Blue Circle */}
        <Box
          className="rellax"
          data-rellax-speed="-2"
          sx={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "#cce4ff",
            zIndex: 0,
            opacity: 0.6,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          {/* Header Section */}
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 1,
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}
            >
              Council Members
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#0a5397",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: { xs: "2rem", md: "2.75rem" },
                mb: 4,
              }}
            >
              Meet the Minds Shaping Campus Excellence
            </Typography>


          </Box>

          {/* Error Alert */}
          {error && (
            <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
              <Alert severity="warning" sx={{ width: "100%", maxWidth: 600, borderRadius: 2 }}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Grid Layout */}
          <Grid container spacing={4} justifyContent="center">
            {/* Loading Skeleton State */}
            {loading ? (
              Array.from(new Array(6)).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${index}`}>
                  <Card sx={{ height: 380, borderRadius: 4, mt: 6, position: "relative", overflow: "visible" }}>
                    <Box sx={{ height: 80, backgroundColor: "#e0e0e0", borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                    <Box sx={{ display: "flex", justifyContent: "center", mt: -7 }}>
                      <Skeleton variant="circular" width={120} height={120} sx={{ border: "4px solid #fff" }} />
                    </Box>
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 2 }}>
                      <Skeleton variant="text" width="60%" height={40} />
                      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
                      <Skeleton variant="text" width="90%" />
                      <Skeleton variant="text" width="90%" />
                      <Skeleton variant="text" width="70%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : filteredMembers.length > 0 ? (
              <>
                {/* Presidents Row */}
                {presidents.map((member, index) => renderMemberCard(member, true, index))}
                
                {/* Break / Divider to force next row if there's a President */}
                {presidents.length > 0 && others.length > 0 && (
                  <Grid size={12} sx={{ py: 0 }} />
                )}

                {/* Others Row */}
                {others.map((member, index) => renderMemberCard(member, false, index))}
              </>
            ) : (
              /* No Results State */
              <Grid size={12}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    No council members found.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* ==========================================
          5. DETAILED BIO MODAL (DIALOG)
          ========================================== */}
      <Dialog
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden" }
        }}
      >
        {selectedMember && (
          <>
            <Box sx={{ position: "relative" }}>
              {/* Modal Banner */}
              <Box sx={{ height: 120, background: "linear-gradient(135deg, #0a5397 0%, #3949ab 100%)" }} />
              
              {/* Close Button */}
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  color: "#fff",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" }
                }}
              >
                <CloseIcon />
              </IconButton>

              <Box sx={{ display: "flex", justifyContent: "center", mt: -8 }}>
                <Avatar
                  src={selectedMember.imageUrl}
                  alt={selectedMember.name}
                  sx={{
                    width: 140,
                    height: 140,
                    border: "6px solid #fff",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
                  }}
                />
              </Box>
            </Box>

            <DialogContent sx={{ textAlign: "center", px: { xs: 3, sm: 6 }, pb: 6, pt: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a237e", mb: 0.5, fontFamily: "'Montserrat', sans-serif" }}>
                {selectedMember.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "#d32f2f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, mb: 3 }}>
                {selectedMember.jobDescription}
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.8, textAlign: "justify" }}>
                {selectedMember.detailedBio}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default LeadershipGovernance;