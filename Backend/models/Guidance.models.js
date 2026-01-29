import mongoose from 'mongoose';

const guidanceSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  qualification: { type: String, required: true },
  programme: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Closed'], 
    default: 'Pending' 
  },
  // CHANGED: Now an array to store multiple admin responses
  adminMessages: [
    {
      note: { type: String },
      timestamp: { type: Date, default: Date.now },
      actionDate: { type: String }, // For easy display: "28 Jan 2026"
      actionTime: { type: String }  // For easy display: "12:30 PM"
    }
  ],
  // Retaining original field for backward compatibility or the "Latest" reply
  adminReply: { type: String }, 
  
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date } 
});

const Guidance = mongoose.model('Guidance', guidanceSchema);
export default Guidance;