// @desc    Get all faculties
import Faculty from "../models/Faculty.models.js";

// @route   GET /api/faculties
export const getFaculties = async (req, res) => {
  try {
    // Sort by newest first
    const faculties = await Faculty.find().sort({ createdAt: -1 });
    res.status(200).json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single faculty by ID
// @route   GET /api/faculties/:id
export const getFacultyById = async (req, res) => {
  const { id } = req.params;

  try {
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new faculty
// @route   POST /api/faculties
export const createFaculty = async (req, res) => {
  const { 
    name, 
    descriptions, 
    imageUrls, 
    coverImage, 
    deanName, 
    deanImage, 
    deanDescription 
  } = req.body;

  // Basic validation
  if (!name || !coverImage || !deanName) {
    return res.status(400).json({ message: "Name, Cover Image, and Dean Name are required." });
  }

  try {
    const newFaculty = new Faculty({
      name,
      descriptions,
      imageUrls,
      coverImage,
      deanName,
      deanImage,
      deanDescription
    });

    const savedFaculty = await newFaculty.save();
    res.status(201).json(savedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a faculty
// @route   PUT /api/faculties/:id
export const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    descriptions, 
    imageUrls, 
    coverImage, 
    deanName, 
    deanImage, 
    deanDescription 
  } = req.body;

  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { 
        name, 
        descriptions, 
        imageUrls, 
        coverImage, 
        deanName, 
        deanImage, 
        deanDescription 
      },
      { new: true } // Return the updated object
    );

    if (!updatedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(updatedFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a faculty
// @route   DELETE /api/faculties/:id
export const deleteFaculty = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(id);

    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};