import mongoose from 'mongoose';

// 1. Sub-schema for individual module rows
const ModuleRowSchema = new mongoose.Schema({
  code: { type: String, trim: true },
  name: { type: String, trim: true },
  credits: { type: String, trim: true }
}, { _id: false });

// 2. Sub-schema for semesters
const SemesterSchema = new mongoose.Schema({
  id: { type: String },
  semesterName: { 
    type: String, 
    required: [true, "Semester name is required"],
    trim: true 
  },
  moduleRows: [ModuleRowSchema]
}, { _id: false });



// 3. Main Course Schema
const CourseSchema = new mongoose.Schema({
  courseName: { 
    type: String, 
    required: [true, "Course name is mandatory"], 
    trim: true 
  },
  courseCategory: { 
    type: String, 
    required: [true, "Course category is mandatory"], 
    trim: true 
  },
  // Array of paragraphs for the description
  courseDescription: {
    type: [String],
    default: []
  },
  duration: { type: String, trim: true },
  intake: { type: String, trim: true },
  awardingBody: { type: String, trim: true },
  
  // Rich Text Content (HTML)
  entryRequirement: { type: String },
  progression: { type: String },
  scholarships: { type: String },
  
  // Nested structure for Semesters
  semesters: {
    type: [SemesterSchema],
    default: []
  },
  
  // Tags and Media
  careerPathways: { type: [String], default: [] },
  coverImage: { 
    type: String, 
    required: [true, "Primary cover image is required"] 
  },
  images: { 
    type: [String], 
    default: [] 
  }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Use existing model or create a new one (prevents overwrite errors)
const Coursemodel = mongoose.models.Coursemodel || mongoose.model('Coursemodel', CourseSchema);

export default Coursemodel;