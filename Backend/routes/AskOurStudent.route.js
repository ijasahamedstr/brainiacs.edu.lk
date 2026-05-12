import express from 'express';
import { 
    createAskOurStudent, 
    getAllAskOurStudents, 
    getAskOurStudentById, 
    updateAskOurStudent, 
    deleteAskOurStudent 
} from '../controller/AskOurStudent.Controller.js';

const askOurStudentRouter = express.Router();

askOurStudentRouter.post('/', createAskOurStudent);          // Create
askOurStudentRouter.get('/', getAllAskOurStudents);          // View All
askOurStudentRouter.get('/:id', getAskOurStudentById);       // Single View
askOurStudentRouter.put('/:id', updateAskOurStudent);        // Update
askOurStudentRouter.delete('/:id', deleteAskOurStudent);     // Delete

export default askOurStudentRouter;