import express from 'express';
import { createEvent, getEvents } from '../controller/Event.Controller.js';

const Eventrouter = express.Router();

Eventrouter.get('/', getEvents);
Eventrouter.post('/', createEvent);

export default Eventrouter;