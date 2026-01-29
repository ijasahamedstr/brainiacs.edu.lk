import express from 'express';
import { createStudentLife, deleteStudentLife, getStudentLife, updateStudentLife } from '../controller/StudentLife.Controller.js';

const StudentLiferouter = express.Router();

// Base path: /api/student-life
StudentLiferouter.route('/')
  .get(getStudentLife)
  .post(createStudentLife);

// ID specific path: /api/student-life/:id
StudentLiferouter.route('/:id')
  .put(updateStudentLife)
  .delete(deleteStudentLife);

export default StudentLiferouter;