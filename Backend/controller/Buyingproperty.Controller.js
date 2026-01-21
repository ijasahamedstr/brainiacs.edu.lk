// New import method

import Buyingproperty from "../models/Buyingproperty.models.js";

export const saveRequest = async (req, res) => {
  try {
    const newRequest = new Buyingproperty(req.body);
    await newRequest.save();
    res.status(201).json({ success: true, message: "Saved Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. VIEW ALL: Get all buying requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Buyingproperty.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. SINGLE VIEW: Get one request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await Buyingproperty.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. UPDATE: Update a request by ID
export const updateRequest = async (req, res) => {
  try {
    const updatedRequest = await Buyingproperty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Returns the updated document and runs schema validation
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Updated Successfully", data: updatedRequest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. DELETE: Remove a request by ID
export const deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await Buyingproperty.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};