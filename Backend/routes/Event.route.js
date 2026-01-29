import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from '../controller/Event.Controller.js';

const Eventrouter = express.Router();

Eventrouter.post('/', createEvent);
Eventrouter.get('/', getAllEvents);
Eventrouter.get('/:id', getEventById);
Eventrouter.put('/:id', updateEvent);
Eventrouter.delete('/:id', deleteEvent);

export default Eventrouter;