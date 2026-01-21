import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" }, // Added this line for Image URL/Base64
  role: { type: String, default: "مدير نظام" },
  twoFASecret: { type: String }, 
  twoFAEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Admin', adminSchema);