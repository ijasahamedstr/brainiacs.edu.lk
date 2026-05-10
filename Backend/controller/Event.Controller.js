// @desc    Create a new event

import Eventmodel from "../models/Event.models.js";

// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const newEvent = new Eventmodel(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all events (sorted by start date)
// @route   GET /api/events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Eventmodel.find().sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Eventmodel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Eventmodel.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Eventmodel.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};