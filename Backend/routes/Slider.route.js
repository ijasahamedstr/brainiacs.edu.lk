import express from 'express';
import { createSlider, deleteSlider, getAllSliders, getSliderById, updateSlider } from '../controller/Slider.Controller.js';

const Sliderrouter = express.Router();

Sliderrouter.post('/', createSlider);
Sliderrouter.get('/', getAllSliders);
Sliderrouter.get('/:id', getSliderById);
Sliderrouter.put('/:id', updateSlider);
Sliderrouter.delete('/:id', deleteSlider);

export default Sliderrouter;