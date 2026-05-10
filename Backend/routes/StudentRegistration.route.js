import express from 'express';
import multer from 'multer';
import os from 'os';
import { 
  createStudent, 
  getStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent 
} from '../controller/StudentController.Controller.js';

const StudentRouter = express.Router();

// 1. Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Compatible with Vercel (/tmp) or local development
    const dest = process.env.NODE_ENV === 'production' ? os.tmpdir() : 'uploads/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// 2. Routes

// Global Student Routes
StudentRouter.route('/')
    // GET: Retrieve all registrations (used by your Manager dashboard)
    .get(getStudents) 
    // POST: Submit new registration (accepts up to 10 files)
    .post(upload.array('documents', 10), createStudent);

// Specific Student Routes (by ID)
StudentRouter.route('/:id')
    // GET: View details of a specific student
    .get(getStudentById)
    // PUT: Update student info or status (also handles new file uploads)
    .put(upload.array('documents', 10), updateStudent)
    // DELETE: Remove student record
    .delete(deleteStudent);

export default StudentRouter;