import express from 'express';
import { createFaculty, deleteFaculty, getFaculties, getFacultyById, updateFaculty } from '../controller/Faculty.Controller.js';

const Facultyrouter = express.Router();

// Define routes
Facultyrouter.get('/', getFaculties);
Facultyrouter.get('/:id', getFacultyById); // Route for Single View
Facultyrouter.post('/', createFaculty);
Facultyrouter.put('/:id', updateFaculty);
Facultyrouter.delete('/:id', deleteFaculty);

export default Facultyrouter;