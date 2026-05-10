import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventName: { 
    type: String, 
    required: [true, "Please provide an event name"], 
    trim: true 
  },
  // Array of Strings for multiple paragraphs of the description
  eventDescription: { 
    type: [String], 
    required: [true, "Description is required"],
    default: [] 
  },
  eventPlace: {
    type: String,
    required: [true, "Please specify the event location"]
  },
  eventTime: {
    type: String, // You can use String (e.g., "10:00 AM") or Date
    required: [true, "Please specify the event time"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"]
  },
  finishDate: {
    type: Date,
    required: [true, "Finish date is required"]
  },
  // Array of Strings for multiple images
  imageUrls: { 
    type: [String], 
    required: [true, "At least one image URL is required"],
    default: []
  },
}, { 
  timestamps: true 
});

// Changed model name to 'Event' to match the new purpose
const Eventmodel = mongoose.model('Eventmodel', EventSchema);
export default Eventmodel;