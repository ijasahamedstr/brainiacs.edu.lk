import express from 'express';
import { createIntake, deleteIntake, getAllIntakes, getSingleIntake, updateIntake } from '../controller/Intake.Controller.js';
// Adjust the path if your folder structure is different

const IntakeRouter = express.Router();

IntakeRouter.post('/',createIntake);
IntakeRouter.get('/', getAllIntakes);
IntakeRouter.get('/:identifier', getSingleIntake); // identifier can be ID or Slug
IntakeRouter.put('/:id', updateIntake);
IntakeRouter.delete('/:id', deleteIntake);

export default IntakeRouter;