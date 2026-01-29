import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true },
  websiteUrl: { type: String, trim: true },
  // Changed from String to Array of Strings
  description: { type: [String], required: true }, 
}, { 
  timestamps: true 
});

const Partner = mongoose.model('Partner', partnerSchema);
export default Partner;