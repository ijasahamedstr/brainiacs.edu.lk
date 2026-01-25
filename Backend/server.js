import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import Adminrouter from "./routes/AccountRegisterAdmin.route.js";
import Guidancerouter from "./routes/Guidance.route.js";
import Eventrouter from "./routes/Event.route.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 3. CORS setup
app.use(cors({
  origin: ["https://brainiacs-edu-lk.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
// Serve the uploads folder statically so you can view images via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 
// 5. Connect Database
connectDB();

// 6. Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use('/api',Adminrouter);

app.use('/api',Guidancerouter);

app.use('/api', Eventrouter);

// 7. Start server
const port = 8001;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});