import Propertyrental from "../models/Propertyrental.models.js";


export const createServiceRequest = async (req, res) => {
    try {
        // 1. Parse the stringified JSON from FormData
        const textData = JSON.parse(req.body.data);

        // 2. Map the uploaded files from Multer
        const mediaFiles = req.files ? req.files.map(file => ({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype
        })) : [];

        // 3. Create the document
        const newRequest = new Propertyrental({
            ...textData,
            media: mediaFiles
        });

        await newRequest.save();

        res.status(201).json({ 
            success: true, 
            message: "Data saved successfully", 
            data: newRequest 
        });
    } catch (error) {
        console.error("Save Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. VIEW ALL: Get all rental requests
export const getAllRentalRequests = async (req, res) => {
  try {
    const requests = await Propertyrental.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. SINGLE VIEW: Get one request by ID
export const getRentalRequestById = async (req, res) => {
  try {
    const request = await Propertyrental.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE: Update a request by ID
export const updateRentalRequest = async (req, res) => {
  try {
    const updatedRequest = await Propertyrental.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. DELETE: Remove a request by ID
export const deleteRentalRequest = async (req, res) => {
  try {
    const deletedRequest = await Propertyrental.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
