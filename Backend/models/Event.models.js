import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  place: { type: String, required: true },
  time: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  images: { type: [String], required: true }, // Array of image URLs
  note: { type: String, default: "Click on the desired image to get a larger preview" },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;