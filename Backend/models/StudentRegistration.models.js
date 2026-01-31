import mongoose from 'mongoose';

const StudentRegistrationSchema = new mongoose.Schema({
  programme: {
    type: String,
    required: [true, "Please provide the programme name"],
    trim: true
  },
  personalInfo: {
    fullName: { type: String, required: [true, "Please provide the student's full name"], trim: true },
    initials: { type: String, required: [true, "Please provide initials"], trim: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    dob: { type: Date, required: [true, "Please provide the date of birth"] },
    nationality: { type: String, default: 'Sri Lankan', trim: true },
    nic: { type: String, trim: true },
    passport: { type: String, trim: true },
    mobile: { type: String, required: [true, "Please provide a mobile contact number"], trim: true },
    whatsapp: { type: String, trim: true },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    }
  },
  guardianInfo: {
    name: { type: String, trim: true },
    mobile: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true }
  },
  education: {
    ol: [{
      year: { type: String, trim: true },
      subject: { type: String, trim: true },
      grade: { type: String, trim: true }
    }],
    al: [{
      year: { type: String, trim: true },
      subject: { type: String, trim: true },
      grade: { type: String, trim: true }
    }],
    alStream: { type: String, trim: true },
    otherQualifications: [{
      name: { type: String, trim: true },
      year: { type: String, trim: true },
      body: { type: String, trim: true },
      grade: { type: String, trim: true }
    }]
  },
  files: [{
    fileName: { type: String },
    filePath: { type: String },
    fileType: { type: String }
  }],
  surveySource: { type: [String], default: [] },
  termsAccepted: {
    type: Boolean,
    required: [true, "You must accept the terms and conditions to proceed"]
  }
}, { 
  timestamps: true 
});

const StudentRegistration = mongoose.model('StudentRegistration', StudentRegistrationSchema);
export default StudentRegistration;