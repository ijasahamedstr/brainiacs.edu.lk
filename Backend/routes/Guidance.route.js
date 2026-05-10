import express from 'express';
import { createGuidanceRequest, deleteGuidanceRequest, getAllGuidanceRequests, getSingleGuidanceRequest, updateGuidanceRequest } from '../controller/Guidance.Controller.js';

const Guidancerouter = express.Router();

Guidancerouter.post('/', createGuidanceRequest);

Guidancerouter.get('/', getAllGuidanceRequests);

Guidancerouter.get('/:id', getSingleGuidanceRequest);

Guidancerouter.put('/:id', updateGuidanceRequest);

Guidancerouter.delete('/:id', deleteGuidanceRequest);

export default Guidancerouter;