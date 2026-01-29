import StudentLife from "../models/StudentLife.models.js";


// Get all sections
export const getStudentLife = async (req, res) => {
  try {
    const data = await StudentLife.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create section (Accepts arrays for descriptions and imageUrls)
export const createStudentLife = async (req, res) => {
  try {
    const newEntry = await StudentLife.create(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update section
export const updateStudentLife = async (req, res) => {
  try {
    const updatedEntry = await StudentLife.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete section
export const deleteStudentLife = async (req, res) => {
  try {
    await StudentLife.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};