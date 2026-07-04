import express from "express";
import connectDB from "./lib/db.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Route Imports
import Adminrouter from "./routes/AccountRegisterAdmin.route.js";
import Guidancerouter from "./routes/Guidance.route.js";
import Sliderrouter from "./routes/Slider.route.js";
import Partnerrouter from "./routes/Partner.route.js";
import StudentLiferouter from "./routes/StudentLife.route.js";
import Eventrouter from "./routes/Event.route.js";
import Newsrouter from "./routes/News.route.js";
import BoardGovernancerouter from "./routes/BoardGovernance.route.js";
import OurTeamrouter from "./routes/OurTeam.route.js";
import StudentRegistrationrouter from "./routes/StudentRegistration.route.js";
import AcademicStaffRouter from "./routes/AcademicStaffs.route.js";
import Facultyrouter from "./routes/Faculty.route.js";
import CourseCategoryrouter from "./routes/CourseCategory.route.js";
import Courserouter from "./routes/Course.route.js";
import askOurStudentRouter from "./routes/AskOurStudent.route.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// 3. CORS setup
app.use(cors({
  origin: ["https://brainiacs-edu-lk-cyan.vercel.app"],
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

app.use('/api/guidance', Guidancerouter);

app.use('/api/events', Eventrouter);

app.use('/api/sliders', Sliderrouter);

app.use('/api/partners', Partnerrouter);

app.use('/api/student-life', StudentLiferouter);

app.use('/api/news', Newsrouter);

app.use('/api/board-governance', BoardGovernancerouter);

app.use('/api/team', OurTeamrouter);

app.use('/api/students', StudentRegistrationrouter);

app.use('/api/academic-staff', AcademicStaffRouter);

app.use('/api/faculties', Facultyrouter);

app.use('/api/course-categories', CourseCategoryrouter);

app.use('/api/course', Courserouter);

app.use('/api/AskOurStudent', askOurStudentRouter);

app.use('/api/Intake', askOurStudentRouter);

// 7. Start server
const port = 8001;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});