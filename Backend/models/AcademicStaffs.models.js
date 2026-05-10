import mongoose from 'mongoose';

const AcademicStaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the staff member's full name"],
    trim: true
  },
  department: {
    type: String,
    required: [true, "Please specify the department"],
    trim: true,
    // Optional: You can add an enum if you want to restrict to specific departments
    // enum: ["Computer Science", "Engineering", "Business Administration", ...]
  },
  jobDescription: {
    type: String, // Acts as the Academic Title/Designation (e.g., Senior Lecturer)
    required: [true, "Please provide an academic title or designation"],
    trim: true
  },
  detailedBio: {
    type: String, // The secondary detailed academic biography or research interests
    required: [true, "Please provide the staff member's biography"],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide a profile image URL"]
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Changed model name from BoardGovernance to AcademicStaff
const AcademicStaff = mongoose.model('AcademicStaff', AcademicStaffSchema);

export default AcademicStaff;