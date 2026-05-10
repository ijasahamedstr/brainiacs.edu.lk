import Coursemodel from "../models/Course.models.js";


// 1. Create Course
export const createCourse = async (req, res) => {
  try {
    const newCourse = new Coursemodel(req.body);
    await newCourse.save();
    res.status(201).json({ success: true, message: "Course Created!", data: newCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. View All Courses (List View)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Coursemodel.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Single View (Get by ID)
export const getCourseById = async (req, res) => {
  try {
    const course = await Coursemodel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update Course
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Coursemodel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ success: true, message: "Course Updated!", data: updatedCourse });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Delete Course
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Coursemodel.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ success: true, message: "Course Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};