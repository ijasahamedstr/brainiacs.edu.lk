import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  heading: { 
    type: String, 
    required: [true, "Please provide a headline for the news article"], 
    trim: true 
  },
  slug: { 
    type: String, 
    required: [true, "URL slug is required"], 
    unique: true,
    lowercase: true
  },
  descriptionImage: { 
    type: String, 
    required: [true, "A featured cover image URL is required"] 
  },
  // Array of Strings for multiple paragraphs/rich-text blocks (from ReactQuill)
  descriptions: { 
    type: [String], 
    required: [true, "News content description is required"],
    default: []
  },
  // Array of Strings for the gallery/assets
  imageUrls: { 
    type: [String], 
    default: [] 
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  wordCount: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: {
      values: ['draft', 'published'],
      message: '{VALUE} is not a supported status'
    },
    default: 'published' 
  },
  author: { 
    type: String, 
    default: 'Admin' 
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Create the model
const NewsModel = mongoose.model('NewsModel', newsSchema);

export default NewsModel;