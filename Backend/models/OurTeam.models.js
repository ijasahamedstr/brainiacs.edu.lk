import mongoose from 'mongoose';

const OurTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the team member's full name"],
    trim: true
  },
  jobDescription: {
    type: String, // Acts as the Designation/Title (e.g., Senior Developer)
    required: [true, "Please provide a job description or designation"],
    trim: true
  },
  detailedBio: {
    type: String, // The secondary detailed description/biography
    required: [true, "Please provide the team member's detailed biography"],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, "Please provide a profile image URL"]
  }
}, { 
  timestamps: true // Tracks when members are added or updated
});

const OurTeam = mongoose.model('OurTeam', OurTeamSchema);
export default OurTeam;