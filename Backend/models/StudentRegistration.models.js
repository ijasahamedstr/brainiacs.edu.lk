import mongoose from 'mongoose';

const AcademicRowSchema = new mongoose.Schema({
  subject: { type: String, trim: true },
  grade: { type: String, trim: true },
  year: { type: String, trim: true },
  attempt: { type: String, trim: true },
  // O/L specific columns
  y1: { type: String, trim: true },
  s1: { type: String, trim: true },
  g1: { type: String, trim: true },
  y2: { type: String, trim: true },
  s2: { type: String, trim: true },
  g2: { type: String, trim: true }
});

const StudentRegistrationSchema = new mongoose.Schema({
  // Application Intent
  programme: { 
    type: String, 
    required: [true, "Please provide the academic programme"],
    trim: true 
  },
  intake: { type: String, trim: true },

  // Student Identity
  fullName: { 
    type: String, 
    required: [true, "Please provide the student's full name"],
    trim: true 
  },
  initials: { 
    type: String, 
    required: [true, "Please provide initials"],
    trim: true 
  },
  gender: { type: String, enum: ['male', 'female'], default: 'male' },
  dob: { 
    type: String, 
    required: [true, "Please provide the date of birth"] 
  },
  nationality: { type: String, default: "Sri Lankan", trim: true },
  nic: { type: String, trim: true },
  mobile: { 
    type: String, 
    required: [true, "Please provide a mobile contact number"],
    trim: true 
  },
  whatsapp: { type: String, trim: true },
  email: { 
    type: String, 
    required: [true, "Please provide an email address"],
    lowercase: true,
    trim: true 
  },

  // Address & Guardian
  permanentAddress: { type: String, trim: true },
  postalCity: { type: String, trim: true },
  guardianName: { type: String, trim: true },
  guardianMobile: { type: String, trim: true },
  guardianAddress: { type: String, trim: true },
  guardianRelationship: { type: String, trim: true },
  guardianEmail: { type: String, lowercase: true, trim: true },

  // Academic History (Arrays)
  olRows: [AcademicRowSchema],
  alRows: [AcademicRowSchema],
  otherQuals: [AcademicRowSchema],
  olExamTypes: { type: [String], default: [] },
  alExamTypes: { type: [String], default: [] },
  alStream: { type: String, trim: true },
  surveySource: { type: [String], default: [] },

  // Uploaded Documents Metadata
  documents: [{
    fileName: String,
    filePath: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Consents
  termsAccepted: { 
    type: Boolean, 
    required: [true, "You must accept the terms and conditions"] 
  },
  privacyConsent: { type: Boolean, default: false }

}, { 
  timestamps: true // Automatically creates createdAt and updatedAt
});

const StudentRegistration = mongoose.model('StudentRegistration', StudentRegistrationSchema);
export default StudentRegistration;