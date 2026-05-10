import CourseCategory from "../models/CourseCategory,models.js";


// CREATE: Save a new architecture
export const createCategory = async (req, res) => {
  try {
    const newTree = new CourseCategory({ categories: req.body.categories });
    await newTree.save();
    res.status(201).json(newTree);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ALL VIEW: Fetch all saved trees
export const getAllCategories = async (req, res) => {
  try {
    const data = await CourseCategory.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SINGLE VIEW: Fetch one by ID
export const getSingleCategory = async (req, res) => {
  try {
    const item = await CourseCategory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Structure not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Overwrite existing hierarchy
export const updateCategory = async (req, res) => {
  try {
    const updated = await CourseCategory.findByIdAndUpdate(
      req.params.id,
      { categories: req.body.categories },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not Found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Remove a structure
export const deleteCategory = async (req, res) => {
  try {
    await CourseCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};