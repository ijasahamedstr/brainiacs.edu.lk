import AcademicStaff from "../models/AcademicStaffs.models.js";


// @desc    Get all academic staff
export const getAcademicStaff = async (req, res) => {
    try {
        // Fetch all staff members sorted by newest first
        const staff = await AcademicStaff.find().sort({ createdAt: -1 });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new academic staff member
export const createAcademicStaff = async (req, res) => {
    // Destructure the new department field from the request body
    const { name, department, jobDescription, detailedBio, imageUrl } = req.body;
    
    try {
        const newStaff = await AcademicStaff.create({
            name,
            department, // Included department
            jobDescription,
            detailedBio,
            imageUrl
        });
        res.status(201).json(newStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an academic staff member
export const updateAcademicStaff = async (req, res) => {
    const { id } = req.params;
    try {
        // findByIdAndUpdate with req.body will automatically include 'department' 
        // if it is passed from the frontend
        const updatedStaff = await AcademicStaff.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        
        res.status(200).json(updatedStaff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an academic staff member
export const deleteAcademicStaff = async (req, res) => {
    const { id } = req.params;
    try {
        const staff = await AcademicStaff.findByIdAndDelete(id);
        
        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        
        res.status(200).json({ message: "Staff member removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};