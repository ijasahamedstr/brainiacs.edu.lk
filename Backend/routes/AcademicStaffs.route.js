import express from 'express';
import { createAcademicStaff, deleteAcademicStaff, getAcademicStaff, updateAcademicStaff } from '../controller/AcademicStaffs.Controller.js';

const AcademicStaffRouter = express.Router();

// Routes for /api/academic-staff
AcademicStaffRouter.get('/', getAcademicStaff);
AcademicStaffRouter.post('/', createAcademicStaff);
AcademicStaffRouter.put('/:id', updateAcademicStaff);
AcademicStaffRouter.delete('/:id', deleteAcademicStaff);

export default AcademicStaffRouter;