import express from 'express';
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../controller/Course.Controller.js';

const Courserouter = express.Router();

Courserouter.post('/', createCourse);          // Create
Courserouter.get('/', getAllCourses);         // View All
Courserouter.get('/:id', getCourseById);      // Single View
Courserouter.put('/:id', updateCourse);       // Update
Courserouter.delete('/:id', deleteCourse);    // Delete

export default Courserouter;