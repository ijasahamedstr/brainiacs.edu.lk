import Partner from "../models/Partner.models.js";


// Get all partners
export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ createdAt: -1 });
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching partners", error: error.message });
  }
};

// Create new partner
export const createPartner = async (req, res) => {
  const { name, logoUrl, description, websiteUrl } = req.body;
  try {
    const newPartner = new Partner({ name, logoUrl, description, websiteUrl });
    await newPartner.save();
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ message: "Error creating partner", error: error.message });
  }
};

// Update partner
export const updatePartner = async (req, res) => {
  try {
    const updatedPartner = await Partner.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedPartner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json(updatedPartner);
  } catch (error) {
    res.status(400).json({ message: "Error updating partner", error: error.message });
  }
};

// Delete partner
export const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    res.status(200).json({ message: 'Partner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting partner", error: error.message });
  }
};