import Guidance from "../models/Guidance.models.js";

// --- CREATE: Save a new request ---
export const createGuidanceRequest = async (req, res) => {
  try {
    const newRequest = new Guidance(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, message: "Request saved successfully", data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllGuidanceRequests = async (req, res) => {
  try {
    const requests = await Guidance.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SINGLE VIEW: Get one request by ID ---
export const getSingleGuidanceRequest = async (req, res) => {
  try {
    const request = await Guidance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE / CLOSE INQUIRY
export const updateGuidanceRequest = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    
    const updatedRequest = await Guidance.findByIdAndUpdate(
      req.params.id,
      { status, adminReply },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.status(200).json({ success: true, data: updatedRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteGuidanceRequest = async (req, res) => {
  try {
    await Guidance.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};