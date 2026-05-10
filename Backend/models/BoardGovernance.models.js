import mongoose from 'mongoose';

const BoardGovernanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the member's full name"],
    trim: true
  },
  jobDescription: {
    type: String, // Acts as the Designation/Title (e.g., Chairman)
    required: [true, "Please provide a job description or designation"],
    trim: true
  },
  detailedBio: {
    type: String, // The secondary detailed description/biography
    required: [true, "Please provide the member's detailed biography"],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide a profile image URL"]
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const BoardGovernance = mongoose.model('BoardGovernance', BoardGovernanceSchema);
export default BoardGovernance;