import mongoose from 'mongoose';

const guidanceSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  qualification: { type: String, required: true },
  programme: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  // New tracking fields
  status: { 
    type: String, 
    enum: ['Pending', 'Closed'], 
    default: 'Pending' 
  },
  adminReply: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Guidance = mongoose.model('Guidance', guidanceSchema);
export default Guidance;