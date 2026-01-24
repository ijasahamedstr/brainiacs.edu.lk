import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import Adminrouter from "./routes/AccountRegisterAdmin.route.js";
import Propertyfinishingrouter from "./routes/Propertyfinishing.route.js";
import Propertyforsalerouter from "./routes/Propertyforsale.route.js";
import Buyingpropertyrouter from "./routes/Buyingproperty.route.js";
import Propertyrentalrouter from "./routes/Propertyrental.route.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 3. CORS setup
app.use(cors({
  origin: ["https://brainiacs-edu-lk.vercel.app", "https://khaild-marketer.vercel.app"],
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

app.use('/api', Adminrouter);
app.use('/api', Propertyfinishingrouter);
app.use('/api', Propertyforsalerouter);
app.use('/api', Buyingpropertyrouter); 
app.use('/api', Propertyrentalrouter); 

// 7. Start server
const port = 8001;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});