// Adjust the path to match your folder structure

import AskOurStudent from "../models/AskOurStudent.models.js";

// Create
export const createAskOurStudent = async (req, res) => {
  try {
    const newAskOurStudent = await AskOurStudent.create(req.body);
    res.status(201).json(newAskOurStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All
export const getAllAskOurStudents = async (req, res) => {
  try {
    const askOurStudents = await AskOurStudent.find().sort({ createdAt: -1 });
    res.json(askOurStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single
export const getAskOurStudentById = async (req, res) => {
  try {
    const askOurStudent = await AskOurStudent.findById(req.params.id);
    if (!askOurStudent) return res.status(404).json({ message: "Student record not found" });
    res.json(askOurStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateAskOurStudent = async (req, res) => {
  try {
    const updated = await AskOurStudent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student record not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteAskOurStudent = async (req, res) => {
  try {
    const deleted = await AskOurStudent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student record not found" });
    res.json({ message: "Student record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};