import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Please provide the partner's name"], 
    trim: true 
  },
  logoUrl: { 
    type: String, 
    required: [true, "Please provide a logo URL"] 
  },
  websiteUrl: { 
    type: String, 
    trim: true 
  },
  // Array of Strings to support multiple paragraphs or bullet points
  description: { 
    type: [String], 
    required: [true, "Please provide at least one description paragraph"],
    default: [] 
  },
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;