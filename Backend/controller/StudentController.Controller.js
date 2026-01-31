
// @desc    CREATE: Register a new student

import StudentRegistration from "../models/StudentRegistration.models.js";

// @route   POST /api/students
export const createStudent = async (req, res) => {
  try {
    // 1. Parse the JSON payload from the form field
    const data = JSON.parse(req.body.payload);

    // 2. Map uploaded files (e.g., certificates, NIC copies)
    const fileEntries = (req.files || []).map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    }));

    // 3. Create the document including the file metadata
    const student = new StudentRegistration({
      ...data,
      documents: fileEntries // Ensure your Schema has a 'documents' field
    });

    // 4. Save to MongoDB
    const savedStudent = await student.save();

    res.status(201).json({ 
      success: true, 
      message: "Student registration saved successfully!",
      data: savedStudent 
    });

  } catch (error) {
    console.error("Registration Save Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save student registration", 
      error: error.message 
    });
  }
};

// @desc    VIEW ALL: Get all students
// @route   GET /api/students
export const getStudents = async (req, res) => {
  try {
    const students = await StudentRegistration.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    SINGLE VIEW: Get one student by ID
// @route   GET /api/students/:id
export const getStudentById = async (req, res) => {
  try {
    const student = await StudentRegistration.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid ID format" });
  }
};

// @desc    UPDATE: Update student info
// @route   PUT /api/students/:id
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if the student exists first
    let student = await StudentRegistration.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2. Parse the JSON payload (coming from form-data "payload" field)
    // If your frontend sends regular JSON, use req.body directly.
    const updateData = req.body.payload ? JSON.parse(req.body.payload) : req.body;

    // 3. Map new uploaded files if any exist
    const newFileEntries = (req.files || []).map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype
    }));

    // 4. Logic for Documents: 
    // Option A: Append new files to existing ones
    // Option B: Overwrite (replace code below with newFileEntries if desired)
    const updatedDocuments = [...student.documents, ...newFileEntries];

    // 5. Apply updates to the document
    const finalUpdate = {
      ...updateData,
      documents: updatedDocuments
    };

    // 6. Save changes
    student = await StudentRegistration.findByIdAndUpdate(id, finalUpdate, {
      new: true,           // Return the updated document
      runValidators: true, // Ensure the updates follow Schema rules
    });

    res.status(200).json({ 
      success: true, 
      message: "Student record updated successfully!",
      data: student 
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update student registration", 
      error: error.message 
    });
  }
};

// @desc    DELETE: Remove a student
// @route   DELETE /api/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await StudentRegistration.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({ success: true, message: "Student record deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid ID" });
  }
};