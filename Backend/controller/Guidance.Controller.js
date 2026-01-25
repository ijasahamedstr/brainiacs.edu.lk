import Guidance from "../models/Guidance.models.js";

export const createGuidanceRequest = async (req, res) => {
  try {
    const newRequest = new Guidance(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};