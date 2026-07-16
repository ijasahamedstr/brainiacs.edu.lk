import mongoose from 'mongoose';

const StudentLifeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please provide a name for this section"], 
    trim: true 
  },
  date: {
    type: Date,
    required: [true, "Please provide a date for this section"]
  },
  descriptions: { 
    type: [String], 
    required: true,
    default: [] 
  },
  imageUrls: { 
    type: [String], 
    required: [true, "At least one image URL is required"] 
  },
  order: { 
    type: Number, 
    default: 0 // Added to support drag-and-drop sequencing
  }
}, { 
  timestamps: true 
});

const StudentLife = mongoose.model('StudentLife', StudentLifeSchema);
export default StudentLife;