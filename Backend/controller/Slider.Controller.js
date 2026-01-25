import SliderModels from "../models/Slider.models.js";


// Create
export const createSlider = async (req, res) => {
  try {
    const newSlider = await SliderModels.create(req.body);
    res.status(201).json(newSlider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await SliderModels.find().sort({ createdAt: -1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single
export const getSliderById = async (req, res) => {
  try {
    const slider = await SliderModels.findById(req.params.id);
    if (!slider) return res.status(404).json({ message: "Not found" });
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateSlider = async (req, res) => {
  try {
    const updated = await SliderModels.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteSlider = async (req, res) => {
  try {
    await SliderModels.findByIdAndDelete(req.params.id);
    res.json({ message: "Slider deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};