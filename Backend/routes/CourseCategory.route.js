import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controller/CourseCategory.Controller.js';

const CourseCategoryrouter = express.Router();

CourseCategoryrouter.post('/', createCategory);
CourseCategoryrouter.get('/', getAllCategories);
CourseCategoryrouter.get('/:id', getSingleCategory);
CourseCategoryrouter.put('/:id', updateCategory);
CourseCategoryrouter.delete('/:id', deleteCategory);

export default CourseCategoryrouter;