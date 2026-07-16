import express from 'express';
import { 
  createStudentLife, 
  deleteStudentLife, 
  getStudentLife, 
  updateStudentLife,
  reorderStudentLife,
  importStudentLife
} from '../controller/StudentLife.Controller.js';

const StudentLiferouter = express.Router();

// Base paths
StudentLiferouter.route('/')
  .get(getStudentLife)
  .post(createStudentLife);

// Bulk Operations (Must be placed before ID routes)
StudentLiferouter.post('/import', importStudentLife);
StudentLiferouter.put('/reorder', reorderStudentLife);

// ID specific paths
StudentLiferouter.route('/:id')
  .put(updateStudentLife)
  .delete(deleteStudentLife);

export default StudentLiferouter;