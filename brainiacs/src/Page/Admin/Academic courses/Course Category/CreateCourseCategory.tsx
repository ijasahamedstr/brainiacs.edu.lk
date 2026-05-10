import { useState } from "react";
import { 
  Box, Typography, Stack, Paper, Button, TextField, 
  CircularProgress, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions,
  IconButton, Fade, Divider, alpha
} from "@mui/material";
import { 
  ArrowBackIosNewOutlined, DeleteOutline, AddCircleOutline,
  SaveOutlined, 
  LayersOutlined,
  ArchitectureOutlined, InfoOutlined
} from "@mui/icons-material";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PRIMARY_INDIGO = "#6366F1"; 
const SLATE_900 = "#0F172A";
const SLATE_600 = "#475569";
const BORDER_COLOR = "#E2E8F0";
const GLOBAL_FONT = "'Montserrat', sans-serif";

const uid = () => Math.random().toString(36).substring(2, 9);

interface CategoryNode {
  id: string;
  title: string;
  children: CategoryNode[];
}

interface AddProps {
  onBack: () => void;
}

const CreateCategory = ({ onBack }: AddProps) => {
  const [rootTitle, setRootTitle] = useState("");
  const [tree, setTree] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const countNodes = (nodes: CategoryNode[]): number => {
    return nodes.reduce((acc, curr) => acc + 1 + countNodes(curr.children), 0);
  };

  const addChild = (parentId: string, title: string) => {
    const recursiveAdd = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.map((n) =>
        n.id === parentId
          ? { ...n, children: [...n.children, { id: uid(), title, children: [] }] }
          : { ...n, children: recursiveAdd(n.children) }
      );
    setTree(recursiveAdd(tree));
  };

  const deleteNode = (id: string) => {
    const recursiveDelete = (nodes: CategoryNode[]): CategoryNode[] =>
      nodes.filter((n) => n.id !== id).map((n) => ({ ...n, children: recursiveDelete(n.children) }));
    setTree(recursiveDelete(tree));
  };

  const addRootCategory = () => {
    if (!rootTitle.trim()) return;
    setTree([...tree, { id: uid(), title: rootTitle, children: [] }]);
    setRootTitle("");
  };

  const handleSaveToDatabase = async () => {
    setLoading(true);
    try {
      const payload = {
        title: tree[0]?.title || "New Architecture",
        categories: tree,
      };
      const response = await fetch(`${API_BASE_URL}/api/course-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) { setConfirmDialogOpen(false); onBack(); }
    } catch (error) { console.error("Save failed:", error); } 
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFDFD", py: 4, px: { xs: 2, md: 6 }, fontFamily: GLOBAL_FONT }}>
      
      {/* TOP HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 5 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <ArchitectureOutlined sx={{ color: PRIMARY_INDIGO, fontSize: 18 }} />
            <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: SLATE_600, fontFamily: GLOBAL_FONT }}>System Architect</Typography>
          </Stack>
          <Button 
            onClick={onBack} 
            startIcon={<ArrowBackIosNewOutlined sx={{ fontSize: 12 }} />} 
            sx={{ fontWeight: 800, fontFamily: GLOBAL_FONT, color: SLATE_900, textTransform: 'none', fontSize: '1.1rem' }}
          >
            Exit to Management
          </Button>
        </Box>

        <Stack direction="row" spacing={2}>
          <Paper elevation={0} sx={{ px: 3, py: 1, borderRadius: "12px", border: `1px solid ${BORDER_COLOR}`, display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="caption" sx={{ fontWeight: 800, color: SLATE_600, fontFamily: GLOBAL_FONT }}>TOTAL NODES:</Typography>
             <Typography sx={{ fontWeight: 900, color: PRIMARY_INDIGO, fontFamily: GLOBAL_FONT }}>{countNodes(tree)}</Typography>
          </Paper>
          <Button 
            variant="contained" 
            onClick={() => setConfirmDialogOpen(true)} 
            disabled={tree.length === 0} 
            startIcon={<SaveOutlined />}
            sx={{ bgcolor: SLATE_900, px: 4, borderRadius: "12px", fontWeight: 700, textTransform: 'none', fontFamily: GLOBAL_FONT }}
          >
            Save Map
          </Button>
        </Stack>
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
        
        {/* LEFT TOOLBAR */}
        <Box sx={{ width: { xs: "100%", lg: "320px" } }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: `1px solid ${BORDER_COLOR}`, background: "#FFF" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, fontFamily: GLOBAL_FONT, color: SLATE_900 }}>ADD ROOT LEVEL</Typography>
            <TextField 
              fullWidth 
              placeholder="e.g. Master Category" 
              value={rootTitle} 
              onChange={(e) => setRootTitle(e.target.value)} 
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: GLOBAL_FONT }}}
              onKeyPress={(e) => e.key === 'Enter' && addRootCategory()}
            />
            <Button 
              fullWidth 
              variant="contained" 
              onClick={addRootCategory} 
              sx={{ borderRadius: '12px', fontFamily: GLOBAL_FONT, fontWeight: 700, bgcolor: PRIMARY_INDIGO, py: 1.2 }}
            >
              Add Root Node
            </Button>
            <Divider sx={{ my: 3 }} />
            <Typography variant="caption" sx={{ color: SLATE_600, display: 'flex', gap: 1, fontFamily: GLOBAL_FONT }}>
              <InfoOutlined sx={{ fontSize: 14 }} /> Root nodes represent the top-level branches of your tree.
            </Typography>
          </Paper>
        </Box>

        {/* MAIN CANVAS */}
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 6, borderRadius: "32px", border: `1px solid ${BORDER_COLOR}`, 
              minHeight: "75vh", background: "#FFF",
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            {tree.length === 0 ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "50vh", opacity: 0.3 }}>
                <LayersOutlined sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: GLOBAL_FONT }}>Architecture Canvas Empty</Typography>
              </Stack>
            ) : (
              tree.map((node) => <RenderNode key={node.id} node={node} onAddChild={addChild} onDelete={deleteNode} />)
            )}
          </Paper>
        </Box>
      </Stack>

      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)} PaperProps={{ sx: { borderRadius: "24px" } }}>
        <DialogTitle sx={{ fontWeight: 900, fontFamily: GLOBAL_FONT }}>Finalize Architecture?</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ fontFamily: GLOBAL_FONT }}>This will save the entire nested tree to the database as a single curriculum map.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)} sx={{ fontWeight: 700, color: SLATE_600, fontFamily: GLOBAL_FONT }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveToDatabase} disabled={loading} sx={{ bgcolor: PRIMARY_INDIGO, px: 4, borderRadius: '10px', fontFamily: GLOBAL_FONT }}>
            {loading ? <CircularProgress size={24} /> : "Save Architecture"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const RenderNode = ({ node, onAddChild, onDelete }: any) => {
  const [isAdding, setIsAdding] = useState(false);
  const [subTitle, setSubTitle] = useState("");

  return (
    <Box sx={{ ml: { xs: 2, md: 8 }, mb: 2, pl: 4, borderLeft: `2px solid ${alpha(PRIMARY_INDIGO, 0.1)}`, position: 'relative' }}>
      <Box sx={{ position: "absolute", left: -6, top: 22, width: 10, height: 10, borderRadius: "50%", bgcolor: PRIMARY_INDIGO }} />

      <Stack direction="row" alignItems="center" spacing={2}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: "8px 16px", borderRadius: "12px", border: `1px solid ${BORDER_COLOR}`,
            display: 'flex', alignItems: 'center', minWidth: '240px',
            bgcolor: "#FFF", transition: '0.2s',
            '&:hover': { borderColor: PRIMARY_INDIGO, transform: "translateX(4px)" }
          }}
        >
          <Typography sx={{ fontWeight: 700, color: SLATE_900, flexGrow: 1, fontSize: '0.9rem', fontFamily: GLOBAL_FONT }}>{node.title}</Typography>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => setIsAdding(!isAdding)} sx={{ color: PRIMARY_INDIGO }}><AddCircleOutline sx={{ fontSize: 18 }} /></IconButton>
            <IconButton size="small" onClick={() => onDelete(node.id)} sx={{ color: "#F43F5E" }}><DeleteOutline sx={{ fontSize: 18 }} /></IconButton>
          </Stack>
        </Paper>
      </Stack>

      {isAdding && (
        <Fade in={isAdding}>
          <Box sx={{ mt: 1.5, mb: 1.5, p: 2, bgcolor: "#F8FAFC", borderRadius: "12px", border: `1px dashed ${PRIMARY_INDIGO}`, maxWidth: '350px' }}>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth size="small" placeholder="Sub-category name..." 
                value={subTitle} onChange={(e) => setSubTitle(e.target.value)} autoFocus
                sx={{ '& .MuiOutlinedInput-root': { fontFamily: GLOBAL_FONT }}}
                onKeyPress={(e) => e.key === 'Enter' && subTitle.trim() && (onAddChild(node.id, subTitle), setSubTitle(""), setIsAdding(false))}
              />
              <Button 
                variant="contained" size="small" 
                onClick={() => { if(subTitle.trim()) onAddChild(node.id, subTitle); setSubTitle(""); setIsAdding(false); }} 
                sx={{ bgcolor: PRIMARY_INDIGO, fontFamily: GLOBAL_FONT }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Fade>
      )}

      <Box sx={{ mt: 1 }}>
        {node.children.map((child: CategoryNode) => (
          <RenderNode key={child.id} node={child} onAddChild={onAddChild} onDelete={onDelete} />
        ))}
      </Box>
    </Box>
  );
};

export default CreateCategory;