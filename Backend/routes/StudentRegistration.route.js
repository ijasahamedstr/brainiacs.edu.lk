import express from 'express';
import multer from "multer";
import os from 'os';
import { createStudent, deleteStudent, getStudentById, getStudents, updateStudent } from '../controller/StudentController.Controller.js';

const StudentRegistrationrouter = express.Router();
// 1. Storage Config - Compatible with Vercel (/tmp) and Local Development
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use /tmp for Vercel production environments, or 'uploads' for local
    const dest = process.env.NODE_ENV === 'production' ? os.tmpdir() : 'uploads/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    // Unique filename to prevent overwriting
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

StudentRegistrationrouter.route('/')
  .post(upload.array('files', 10), createStudent) 
  .get(getStudents);

StudentRegistrationrouter.route('/:id')
  .get(getStudentById)
  .put(upload.array('files', 10), updateStudent) 
  .delete(deleteStudent);

export default StudentRegistrationrouter;