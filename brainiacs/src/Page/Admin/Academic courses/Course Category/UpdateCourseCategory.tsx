import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, Tooltip, Fade, Divider, Breadcrumbs,
   Chip, Alert, Snackbar, InputAdornment,
  Menu, MenuItem, ListItemIcon, ListItemText
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddCircleOutline,
  AccountTreeOutlined,  CloseOutlined,
  InfoOutlined, ChevronRightOutlined,
  HistoryOutlined, SearchOutlined, FilterAltOutlined,
  ContentCopyOutlined, DriveFileRenameOutline,
   SortByAlphaOutlined,
   SaveAsOutlined, HelpOutline,
  DragIndicatorOutlined, MoreVertOutlined,
  AutoFixHighOutlined, WarningAmberRounded
} from "@mui/icons-material";

/**
 * ENHANCED STYLE CONFIGURATION
 */
const PRIMARY_INDIGO = "#4F46E5";
const SECONDARY_INDIGO = "#3730A3";
const SLATE_800 = "#1E293B";
const SLATE_600 = "#475569";
const SLATE_500 = "#64748B";
const SLATE_50 = "#F8FAFC";
const BORDER_COLOR = "#E2E8F0";
const GLOBAL_FONT = "'Montserrat', sans-serif";

const uid = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-3);

interface CategoryNode {
  id: string;
  _id?: string;
  title: string;
  children: CategoryNode[];
  metadata?: {
    lastModified: string;
    isLocked?: boolean;
    tag?: string;
  };
}

interface UpdateProps {
  itemData: {
    _id: string;
    categories: CategoryNode[];
    sectionTitle?: string;
  };
  onBack: () => void;
}

const UpdateCategory = ({ itemData, onBack }: UpdateProps) => {
  // --- CORE STATE ---
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [history, setHistory] = useState<CategoryNode[][]>([]);
  const [rootTitle, setRootTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- UI STATE ---
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" as "success" | "info" | "error" });
  const [stats, setStats] = useState({ totalNodes: 0, maxDepth: 0 });
  const [isModified, setIsModified] = useState(false);

  // Initialize Data
  useEffect(() => {
    if (itemData?.categories) {
      const normalize = (nodes: any[]): CategoryNode[] => 
        nodes.map(n => ({
          ...n,
          id: n.id || n._id || uid(),
          title: n.title || "Untitled Node",
          children: n.children ? normalize(n.children) : [],
          metadata: { lastModified: new Date().toISOString() }
        }));
      const normalizedTree = normalize(itemData.categories);
      setTree(normalizedTree);
      updateAnalytics(normalizedTree);
    }
  }, [itemData]);

  // --- ANALYTICS ENGINE ---
  const updateAnalytics = (currentTree: CategoryNode[]) => {
    let count = 0;
    let maxD = 0;
    const traverse = (nodes: CategoryNode[], depth: number) => {
      count += nodes.length;
      maxD = Math.max(maxD, depth);
      nodes.forEach(n => traverse(n.children, depth + 1));
    };
    traverse(currentTree, 1);
    setStats({ totalNodes: count, maxDepth: maxD });
  };

  // --- HISTORY MANAGEMENT ---
  const saveToHistory = useCallback((newTree: CategoryNode[]) => {
    setHistory(prev => [...prev.slice(-19), tree]); // Keep last 20 steps
    setTree(newTree);
    updateAnalytics(newTree);
    setIsModified(true);
  }, [tree]);

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setTree(previous);
    updateAnalytics(previous);
    setSnackbar({ open: true, message: "Reverted to previous state", type: "info" });
  };

  // --- TREE MUTATIONS ---
  const addChild = (parentId: string, title: string) => {
    const recursiveAdd = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((n) =>
        n.id === parentId
          ? { 
              ...n, 
              children: [...n.children, { id: uid(), title, children: [], metadata: { lastModified: new Date().toISOString() } }] 
            }
          : { ...n, children: recursiveAdd(n.children) }
      );
    saveToHistory(recursiveAdd(tree));
  };

  const updateNodeTitle = (id: string, newTitle: string) => {
    const recursiveUpdate = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((n) =>
        n.id === id 
          ? { ...n, title: newTitle, metadata: { ...n.metadata, lastModified: new Date().toISOString() } }
          : { ...n, children: recursiveUpdate(n.children) }
      );
    saveToHistory(recursiveUpdate(tree));
  };

  const deleteNode = (id: string) => {
    const recursiveDelete = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes
        .filter((n) => n.id !== id)
        .map((n) => ({ ...n, children: recursiveDelete(n.children) }));
    saveToHistory(recursiveDelete(tree));
  };

  const addRootCategory = () => {
    if (!rootTitle.trim()) return;
    saveToHistory([...tree, { id: uid(), title: rootTitle, children: [], metadata: { lastModified: new Date().toISOString() } }]);
    setRootTitle("");
  };

  const sortAlphabetically = () => {
    const recursiveSort = (nodes: CategoryNode[]): CategoryNode[] => {
      return [...nodes]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(n => ({ ...n, children: recursiveSort(n.children) }));
    };
    saveToHistory(recursiveSort(tree));
    setSnackbar({ open: true, message: "Sorted architecture alphabetically", type: "success" });
  };

  const confirmUpdate = async () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course-categories/${itemData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: tree }),
      });
      if (response.ok) {
        setSnackbar({ open: true, message: "Architecture pushed successfully", type: "success" });
        setTimeout(onBack, 1000);
      } else throw new Error();
    } catch (error) {
      setSnackbar({ open: true, message: "Network error: Failed to push updates", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // --- SEARCH HIGHLIGHTING LOGIC ---
  const filteredTree = useMemo(() => {
    if (!searchQuery) return tree;
    const search = searchQuery.toLowerCase();
    const filterNodes = (nodes: CategoryNode[]): CategoryNode[] => {
      return nodes
        .map(n => ({ ...n, children: filterNodes(n.children) }))
        .filter(n => n.title.toLowerCase().includes(search) || n.children.length > 0);
    };
    return filterNodes(tree);
  }, [tree, searchQuery]);

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontFamily: GLOBAL_FONT,
      fontSize: "0.875rem",
      backgroundColor: "#FFFFFF",
      "& fieldset": { borderColor: BORDER_COLOR },
      "&:hover fieldset": { borderColor: PRIMARY_INDIGO },
      "&.Mui-focused fieldset": { borderColor: PRIMARY_INDIGO, borderWidth: "2px" },
    },
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: SLATE_50, py: 4, px: { xs: 2, md: 6 } }}>
      
      {/* GLOBAL ALERTS */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.type} variant="filled" sx={{ borderRadius: "12px", fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* STICKY TOP NAVIGATION */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)", py: 1 }}>
        <Box>
            <Breadcrumbs separator={<ChevronRightOutlined sx={{ fontSize: 16 }} />} sx={{ mb: 1 }}>
                <Typography sx={{ fontFamily: GLOBAL_FONT, color: SLATE_500, fontSize: "0.75rem", fontWeight: 600 }}>SYSTEM ADMIN</Typography>
                <Typography sx={{ fontFamily: GLOBAL_FONT, color: SLATE_500, fontSize: "0.75rem", fontWeight: 600 }}>ARCHITECTURE</Typography>
                <Typography sx={{ fontFamily: GLOBAL_FONT, color: PRIMARY_INDIGO, fontSize: "0.75rem", fontWeight: 800 }}>REVISION v2.4</Typography>
            </Breadcrumbs>
            <Button 
                onClick={onBack} 
                startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: "14px" }} />} 
                sx={{ fontFamily: GLOBAL_FONT, color: SLATE_800, fontWeight: 800, fontSize: "0.9rem", p: 0, textTransform: "none" }}
            >
                Exit Revision Mode
            </Button>
        </Box>

        <Stack direction="row" spacing={2}>
            <Tooltip title="Undo last action">
              <span>
                <IconButton onClick={undo} disabled={history.length === 0} sx={{ border: `1px solid ${BORDER_COLOR}`, bgcolor: "#FFF" }}>
                  <HistoryOutlined />
                </IconButton>
              </span>
            </Tooltip>
            
            <Button 
              variant="contained" 
              onClick={() => setConfirmDialogOpen(true)}
              disabled={loading || !isModified}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveAsOutlined />}
              sx={{ 
                  fontFamily: GLOBAL_FONT, bgcolor: SLATE_800, px: 4, py: 1.2, 
                  borderRadius: "12px", fontWeight: 700, textTransform: "none",
                  boxShadow: "0 10px 15px -3px rgba(30, 41, 59, 0.25)",
                  "&:hover": { bgcolor: "#000" }
              }}
            >
              Commit Changes
            </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
        
        {/* LEFT CONTROL PANEL */}
        <Box sx={{ width: { xs: "100%", lg: "380px" }, position: { lg: "sticky" }, top: 100 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${BORDER_COLOR}`, mb: 3, bgcolor: "#FFF" }}>
                <Stack spacing={3}>
                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <AutoFixHighOutlined sx={{ color: PRIMARY_INDIGO, fontSize: 20 }} />
                            <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 900, color: SLATE_800, fontSize: "1.1rem" }}>
                                Smart Controls
                            </Typography>
                          </Stack>
                          {isModified && <Chip label="Modified" size="small" color="warning" sx={{ fontWeight: 700, fontSize: "0.6rem" }} />}
                        </Stack>
                        <Typography sx={{ fontFamily: GLOBAL_FONT, color: SLATE_500, fontSize: "0.75rem", fontWeight: 500, mt: 0.5 }}>
                            Structural tools for bulk editing.
                        </Typography>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 800, fontSize: "0.65rem", color: SLATE_500, mb: 1.5, letterSpacing: "1px" }}>
                            QUICK SEARCH HIERARCHY
                        </Typography>
                        <TextField 
                            fullWidth size="small" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find category..." 
                            sx={inputStyle}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ fontSize: 18 }} /></InputAdornment>,
                              endAdornment: searchQuery && (
                                <IconButton size="small" onClick={() => setSearchQuery("")}><CloseOutlined sx={{ fontSize: 14 }} /></IconButton>
                              )
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 800, fontSize: "0.65rem", color: SLATE_500, mb: 1.5, letterSpacing: "1px" }}>
                            STRUCTURE APPEND
                        </Typography>
                        <TextField 
                            fullWidth size="small" value={rootTitle} 
                            onChange={(e) => setRootTitle(e.target.value)} 
                            placeholder="New Root Department..." 
                            sx={inputStyle}
                            onKeyPress={(e) => e.key === 'Enter' && addRootCategory()}
                        />
                        <Button 
                            fullWidth variant="outlined" 
                            onClick={addRootCategory}
                            startIcon={<AddCircleOutline />}
                            sx={{ mt: 1.5, borderColor: BORDER_COLOR, color: SLATE_800, borderRadius: "10px", py: 1, fontWeight: 700, fontFamily: GLOBAL_FONT, textTransform: "none" }}
                        >
                            Add Root Node
                        </Button>
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button 
                        fullWidth
                        onClick={sortAlphabetically}
                        startIcon={<SortByAlphaOutlined />}
                        sx={{ bgcolor: "#F1F5F9", color: SLATE_800, borderRadius: "10px", py: 1, fontWeight: 700, fontSize: "0.75rem", textTransform: "none" }}
                      >
                        Sort A-Z
                      </Button>
                      <Button 
                        fullWidth
                        sx={{ bgcolor: "#F1F5F9", color: SLATE_800, borderRadius: "10px", py: 1, fontWeight: 700, fontSize: "0.75rem", textTransform: "none" }}
                        startIcon={<FilterAltOutlined />}
                      >
                        Filter
                      </Button>
                    </Stack>
                </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: "24px", border: `1px solid ${BORDER_COLOR}`, bgcolor: SLATE_800, color: "#FFF" }}>
                <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 800, fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", mb: 2, letterSpacing: 1 }}>
                  ARCHITECTURE INSIGHTS
                </Typography>
                <Stack spacing={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.85rem", fontWeight: 500 }}>Total Categorizations</Typography>
                    <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.85rem", fontWeight: 900 }}>{stats.totalNodes}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.85rem", fontWeight: 500 }}>Hierarchy Depth</Typography>
                    <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.85rem", fontWeight: 900 }}>Level {stats.maxDepth}</Typography>
                  </Stack>
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InfoOutlined sx={{ fontSize: 16, color: PRIMARY_INDIGO }} />
                    <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                      Nested items are restricted to Level 8.
                    </Typography>
                  </Stack>
                </Stack>
            </Paper>
        </Box>

        {/* MAIN HIERARCHY CANVAS */}
        <Box sx={{ flexGrow: 1, width: "100%" }}>
            <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 5 }, borderRadius: "32px", border: `1px solid ${BORDER_COLOR}`, 
                bgcolor: "#FFF", minHeight: "75vh", position: "relative",
                backgroundImage: "radial-gradient(#E2E8F0 1px, transparent 1px)",
                backgroundSize: "30px 30px"
            }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ bgcolor: PRIMARY_INDIGO, p: 0.8, borderRadius: "10px", display: "flex", color: "#FFF" }}>
                        <AccountTreeOutlined sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 900, fontSize: "1.1rem", color: SLATE_800 }}>
                            Curriculum Blueprint
                        </Typography>
                        <Typography sx={{ fontFamily: GLOBAL_FONT, color: SLATE_500, fontSize: "0.75rem", fontWeight: 500 }}>
                          Map of {itemData.sectionTitle || "Standard Departments"}
                        </Typography>
                      </Box>
                  </Stack>
                  
                  {searchQuery && (
                    <Chip 
                      label={`Matches Found: ${stats.totalNodes}`} 
                      onDelete={() => setSearchQuery("")}
                      sx={{ fontFamily: GLOBAL_FONT, fontWeight: 700, bgcolor: "#EEF2FF", color: PRIMARY_INDIGO }}
                    />
                  )}
                </Stack>

                <Box sx={{ position: "relative" }}>
                    {filteredTree.length === 0 ? (
                      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
                        <HelpOutline sx={{ fontSize: 60, color: BORDER_COLOR, mb: 2 }} />
                        <Typography sx={{ fontFamily: GLOBAL_FONT, color: SLATE_500, fontWeight: 600 }}>
                          No matching categories found in this architecture.
                        </Typography>
                      </Stack>
                    ) : (
                      filteredTree.map((node) => (
                        <RenderNode 
                            key={node.id} 
                            node={node} 
                            onAddChild={addChild} 
                            onUpdateTitle={updateNodeTitle}
                            onDelete={deleteNode} 
                            inputStyle={inputStyle}
                            level={1}
                        />
                      ))
                    )}
                </Box>
            </Paper>
        </Box>
      </Stack>

      {/* COMMIT CONFIRMATION MODAL */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => setConfirmDialogOpen(false)} 
        PaperProps={{ sx: { borderRadius: "28px", p: 1, maxWidth: "450px" } }}
      >
        <DialogTitle sx={{ fontFamily: GLOBAL_FONT, fontWeight: 900, display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberRounded sx={{ color: "#F59E0B" }} /> Push Revision?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: GLOBAL_FONT, color: SLATE_600, fontSize: "0.95rem", lineHeight: 1.6 }}>
            You are about to push <strong>{stats.totalNodes} nodes</strong> to the production database. This will overwrite all previous versions of this curriculum map.
          </DialogContentText>
          <Box sx={{ mt: 3, p: 2, bgcolor: SLATE_50, borderRadius: "16px", border: `1px solid ${BORDER_COLOR}` }}>
             <Stack spacing={1}>
                <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.75rem", fontWeight: 700, color: SLATE_500 }}>REVISION SUMMARY</Typography>
                <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.8rem", color: SLATE_800 }}>• Tree Depth: {stats.maxDepth} Levels</Typography>
                <Typography sx={{ fontFamily: GLOBAL_FONT, fontSize: "0.8rem", color: SLATE_800 }}>• Last Action: {history.length > 0 ? "Manual Adjustment" : "Initial Load"}</Typography>
             </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontFamily: GLOBAL_FONT, fontWeight: 700, color: SLATE_500, textTransform: "none" }}>Keep Editing</Button>
          <Button 
            variant="contained" 
            onClick={confirmUpdate} 
            sx={{ 
              fontFamily: GLOBAL_FONT, fontWeight: 800, bgcolor: PRIMARY_INDIGO, 
              borderRadius: "12px", px: 4, textTransform: "none",
              "&:hover": { bgcolor: SECONDARY_INDIGO } 
            }}
          >
            Confirm & Push
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* --- ENHANCED RECURSIVE NODE COMPONENT --- */
const RenderNode = ({ node, onAddChild, onUpdateTitle, onDelete, inputStyle, level }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [editTitle, setEditTitle] = useState(node.title);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const submitTitleUpdate = () => {
    if (editTitle.trim() && editTitle !== node.title) {
      onUpdateTitle(node.id, editTitle);
    }
    setIsEditing(false);
  };

  return (
    <Box sx={{ 
      ml: level === 1 ? 0 : { xs: 2, md: 5 }, 
      mb: 1.5, pl: level === 1 ? 0 : 3, 
      borderLeft: level === 1 ? "none" : `2px solid ${BORDER_COLOR}`, 
      position: 'relative',
      "&:hover > .node-connector": { borderColor: PRIMARY_INDIGO, width: 25 }
    }}>
      {/* Visual Thread Connector */}
      {level > 1 && (
        <Box className="node-connector" sx={{ 
          position: "absolute", left: 0, top: 28, width: 15, height: 2, 
          bgcolor: BORDER_COLOR, transition: "0.3s ease" 
        }} />
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <Paper elevation={0} className="node-card" sx={{ 
            display: 'flex', alignItems: 'center', px: 2, py: 1.2, 
            borderRadius: "16px", border: isEditing ? `2px solid ${PRIMARY_INDIGO}` : `1px solid ${BORDER_COLOR}`,
            bgcolor: "#FFFFFF", transition: "all 0.2s ease", minWidth: "280px",
            boxShadow: isEditing ? "0 10px 25px -5px rgba(79, 70, 229, 0.2)" : "none",
            "&:hover": { borderColor: PRIMARY_INDIGO, transform: "translateX(4px)" }
        }}>
          <DragIndicatorOutlined sx={{ color: BORDER_COLOR, fontSize: 18, mr: 1, cursor: "grab" }} />
          
          {isEditing ? (
            <TextField 
              fullWidth variant="standard" size="small" autoFocus
              value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
              onBlur={submitTitleUpdate}
              onKeyPress={(e) => e.key === 'Enter' && submitTitleUpdate()}
              InputProps={{ disableUnderline: true, sx: { fontFamily: GLOBAL_FONT, fontWeight: 700, fontSize: "0.9rem" } }}
            />
          ) : (
            <Typography 
              onClick={() => setIsEditing(true)}
              sx={{ fontFamily: GLOBAL_FONT, fontWeight: 700, fontSize: "0.9rem", color: SLATE_800, flexGrow: 1, cursor: "pointer" }}
            >
              {node.title}
            </Typography>
          )}
          
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Quick Add">
                <IconButton size="small" onClick={() => setIsAdding(!isAdding)} sx={{ color: PRIMARY_INDIGO }}>
                    <AddCircleOutline sx={{ fontSize: 18 }} />
                </IconButton>
            </Tooltip>
            
            <IconButton size="small" onClick={handleMenuOpen} sx={{ color: SLATE_500 }}>
                <MoreVertOutlined sx={{ fontSize: 18 }} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" } }}>
               <MenuItem onClick={() => { setIsEditing(true); handleMenuClose(); }}>
                  <ListItemIcon><DriveFileRenameOutline fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Rename" primaryTypographyProps={{ fontFamily: GLOBAL_FONT, fontSize: "0.8rem", fontWeight: 600 }} />
               </MenuItem>
               <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon><ContentCopyOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText primary="Duplicate" primaryTypographyProps={{ fontFamily: GLOBAL_FONT, fontSize: "0.8rem", fontWeight: 600 }} />
               </MenuItem>
               <Divider />
               <MenuItem onClick={() => { onDelete(node.id); handleMenuClose(); }} sx={{ color: "#F43F5E" }}>
                  <ListItemIcon><DeleteOutline fontSize="small" sx={{ color: "#F43F5E" }} /></ListItemIcon>
                  <ListItemText primary="Delete" primaryTypographyProps={{ fontFamily: GLOBAL_FONT, fontSize: "0.8rem", fontWeight: 600 }} />
               </MenuItem>
            </Menu>
          </Stack>
        </Paper>
        
        {node.children?.length > 0 && !isAdding && (
          <Chip 
            label={node.children.length} 
            size="small" 
            sx={{ height: 20, fontSize: "0.65rem", fontWeight: 900, bgcolor: SLATE_50, color: SLATE_500, border: `1px solid ${BORDER_COLOR}` }} 
          />
        )}
      </Stack>

      {/* NESTED ADDITION UI */}
      {isAdding && (
        <Fade in={isAdding}>
          <Box sx={{ mt: 2, mb: 2, ml: 2, p: 2, borderRadius: "18px", border: `2px solid ${PRIMARY_INDIGO}`, bgcolor: "#FFF", maxWidth: "400px", boxShadow: "0 15px 35px -10px rgba(0,0,0,0.1)" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontFamily: GLOBAL_FONT, fontWeight: 800, fontSize: "0.65rem", color: PRIMARY_INDIGO, letterSpacing: 0.5 }}>
                  NEW SUB-CATEGORY
              </Typography>
              <IconButton size="small" onClick={() => setIsAdding(false)}><CloseOutlined sx={{ fontSize: 14 }} /></IconButton>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth size="small" placeholder="Enter department name..." 
                value={subTitle} onChange={(e) => setSubTitle(e.target.value)} 
                sx={inputStyle} autoFocus
                onKeyPress={(e) => {
                  if(e.key === 'Enter' && subTitle.trim()) {
                    onAddChild(node.id, subTitle);
                    setSubTitle(""); setIsAdding(false);
                  }
                }}
              />
              <Button 
                variant="contained" size="small"
                onClick={() => { if (subTitle.trim()) onAddChild(node.id, subTitle); setSubTitle(""); setIsAdding(false); }}
                sx={{ bgcolor: PRIMARY_INDIGO, borderRadius: "10px", textTransform: "none", px: 3, fontWeight: 800, fontFamily: GLOBAL_FONT }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Fade>
      )}

      {/* RECURSIVE RENDER */}
      <Box sx={{ mt: 1 }}>
        {node.children && node.children.map((child: CategoryNode) => (
          <RenderNode 
            key={child.id} 
            node={child} 
            onAddChild={onAddChild} 
            onUpdateTitle={onUpdateTitle}
            onDelete={onDelete} 
            inputStyle={inputStyle} 
            level={level + 1}
          />
        ))}
      </Box>
    </Box>
  );
};

export default UpdateCategory;