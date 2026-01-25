import express from 'express';
import { createGuidanceRequest } from '../controller/Guidance.Controller.js';

const Guidancerouter = express.Router();

Guidancerouter.post('/submit', createGuidanceRequest);

export default Guidancerouter;