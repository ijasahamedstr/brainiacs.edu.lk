import mongoose from 'mongoose';

const IntakeSchema = new mongoose.Schema({
  intakeYear: { 
    type: String, // You can change to Number if you prefer strict math operations
    required: [true, "Please provide an intake year"], 
    trim: true 
  }
}, { 
  timestamps: true 
});

const IntakeModel = mongoose.model('Intake', IntakeSchema);
export default IntakeModel;