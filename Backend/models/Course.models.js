import mongoose from 'mongoose';

// 1. Sub-schema for individual module rows
const ModuleRowSchema = new mongoose.Schema({
  id: { type: String }, // Optional: helpful if you generate IDs on the frontend
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

// 3. Sub-schema for nested Entry Requirements (Category + Bullet Points)
const EntryRequirementSchema = new mongoose.Schema({
  category: { type: String, trim: true },
  descriptions: { type: [String], default: [] }
}, { _id: false });

// 4. Main Course Schema
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
  
  isCampusOffering: {
    type: Boolean,
    default: false
  },

  courseDescription: {
    type: [String],
    default: []
  },
  duration: { type: String, trim: true },
  intake: { type: String, trim: true },
  awardingBody: { type: String, trim: true },
  
  // Structured Entry Requirements
  entryRequirements: { 
    type: [EntryRequirementSchema], 
    default: [] 
  },
  
  progression: { type: String },
  scholarships: { type: String },
  
  // NEW: Tracks which module structure the course uses
  moduleMode: {
    type: String,
    enum: ['semester', 'course'],
    default: 'semester'
  },

  // Stores semester-based modules
  semesters: {
    type: [SemesterSchema],
    default: []
  },

  // NEW: Stores flat course modules (used when moduleMode === 'course')
  courseModules: {
    type: [ModuleRowSchema],
    default: []
  },
  
  careerPathways: { type: [String], default: [] },
  
  // NEW: Wide format banner image
  bannerImage: {
    type: String,
    trim: true
  },

  coverImage: { 
    type: String, 
    required: [true, "Primary cover image is required"] 
  },
  images: { 
    type: [String], 
    default: [] 
  }
}, { 
  timestamps: true 
});

// Use existing model or create a new one (prevents overwrite errors)
const Coursemodel = mongoose.models.Coursemodel || mongoose.model('Coursemodel', CourseSchema);

export default Coursemodel;