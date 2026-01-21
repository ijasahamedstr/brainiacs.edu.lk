import Contact from "../models/Propertyfinishing.models.js";

// 1. CREATE: Save a new contact
export const saveContact = async (req, res) => {
  try {
    const { name, mobile, seventhRows } = req.body;
    const newContact = new Contact({
      name,
      mobile,
      contactMethod: seventhRows ? seventhRows[0] : ''
    });

    await newContact.save();
    res.status(201).json({ success: true, message: "Data saved successfully", data: newContact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. VIEW ALL: Get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. SINGLE VIEW: Get one contact by ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. UPDATE: Update a contact by ID
export const updateContact = async (req, res) => {
  try {
    const { name, mobile, seventhRows } = req.body;
    const updatedData = {
      name,
      mobile,
      contactMethod: seventhRows ? seventhRows[0] : undefined
    };

    const contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      updatedData, 
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Updated successfully", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. DELETE: Remove a contact by ID
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};