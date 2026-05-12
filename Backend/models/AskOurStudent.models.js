import mongoose from 'mongoose';

const AskOurStudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the student's full name"],
    trim: true
  },
  course: {
    type: String, 
    required: [true, "Please provide the student's course"],
    trim: true
  },
  batch: {
    type: String, 
    required: [true, "Please provide the student's batch year or number"],
    trim: true
  },
  description: {
    type: String, 
    required: [true, "Please provide a description, testimonial, or quote from the student"],
    trim: true
  },
  image: {
    type: String,
    required: [true, "Please provide a profile image URL"]
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const AskOurStudent = mongoose.model('AskOurStudent', AskOurStudentSchema);
export default AskOurStudent;