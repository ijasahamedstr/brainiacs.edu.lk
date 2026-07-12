import IntakeModel from "../models/Intake.models.js";

// @desc    Create a new intake
// @route   POST /api/intakes
export const createIntake = async (req, res) => {
  try {
    const newIntake = new IntakeModel(req.body);
    const savedIntake = await newIntake.save();
    res.status(201).json(savedIntake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all intakes (sorted by intake year)
// @route   GET /api/intakes
export const getAllIntakes = async (req, res) => {
  try {
    const intakes = await IntakeModel.find().sort({ intakeYear: 1 });
    res.status(200).json(intakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single intake by ID
// @route   GET /api/intakes/:identifier
export const getSingleIntake = async (req, res) => {
  try {
    // Uses req.params.identifier to match the router file you created earlier
    const intake = await IntakeModel.findById(req.params.identifier);
    if (!intake) return res.status(404).json({ message: "Intake not found" });
    res.status(200).json(intake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an intake
// @route   PUT /api/intakes/:id
export const updateIntake = async (req, res) => {
  try {
    const updatedIntake = await IntakeModel.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );
    if (!updatedIntake) return res.status(404).json({ message: "Intake not found" });
    res.status(200).json(updatedIntake);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an intake
// @route   DELETE /api/intakes/:id
export const deleteIntake = async (req, res) => {
  try {
    const deletedIntake = await IntakeModel.findByIdAndDelete(req.params.id);
    if (!deletedIntake) return res.status(404).json({ message: "Intake not found" });
    res.status(200).json({ message: "Intake deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};