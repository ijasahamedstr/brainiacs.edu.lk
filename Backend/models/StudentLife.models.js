import mongoose from 'mongoose';

const StudentLifeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please provide a name for this section"], 
    trim: true 
  },
  // Array of Strings for multiple paragraphs
  descriptions: { 
    type: [String], 
    required: true,
    default: [] 
  },
  // Array of Strings for multiple images
  imageUrls: { 
    type: [String], 
    required: [true, "At least one image URL is required"] 
  },
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt
});

const StudentLife = mongoose.model('StudentLife', StudentLifeSchema);
export default StudentLife;