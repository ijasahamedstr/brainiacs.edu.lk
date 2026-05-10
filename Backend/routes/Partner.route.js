import express from 'express';
import { createPartner, deletePartner, getPartners, updatePartner } from '../controller/Partner.Controller.js';

const Partnerrouter = express.Router();

Partnerrouter.get('/', getPartners);
Partnerrouter.post('/', createPartner);
Partnerrouter.put('/:id', updatePartner);
Partnerrouter.delete('/:id', deletePartner);

export default Partnerrouter;