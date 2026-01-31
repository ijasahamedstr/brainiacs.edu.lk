import express from 'express';
import { createNews, deleteNews, getAllNews, getSingleNews, updateNews } from '../controller/News.Controller.js';

const Newsrouter = express.Router();

Newsrouter.post('/', createNews);
Newsrouter.get('/', getAllNews);
Newsrouter.get('/:identifier', getSingleNews); // identifier can be ID or Slug
Newsrouter.put('/:id', updateNews);
Newsrouter.delete('/:id', deleteNews);

export default Newsrouter;