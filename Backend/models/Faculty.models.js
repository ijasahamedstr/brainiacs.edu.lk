import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  descriptions: {
    type: [String], // Array of strings for paragraph blocks
    default: []
  },
  imageUrls: {
    type: [String], // Array of strings for gallery images
    default: []
  },
  coverImage: {
    type: String,
    required: true
  },
  deanName: {
    type: String,
    required: true
  },
  deanImage: {
    type: String,
    required: true
  },
  deanDescription: {
    type: String,
    default: "" // Optional field for Dean's bio/message
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Faculty = mongoose.model('Faculty', facultySchema);

export default Faculty;