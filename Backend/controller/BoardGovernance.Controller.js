import BoardGovernance from "../models/BoardGovernance.models.js";


// @desc    Get all board members
export const getBoardMembers = async (req, res) => {
    try {
        const members = await BoardGovernance.find().sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new board member
export const createBoardMember = async (req, res) => {
    const { name, jobDescription, detailedBio, imageUrl } = req.body;
    try {
        const newMember = await BoardGovernance.create({
            name,
            jobDescription,
            detailedBio,
            imageUrl
        });
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a board member
export const updateBoardMember = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedMember = await BoardGovernance.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedMember) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a board member
export const deleteBoardMember = async (req, res) => {
    const { id } = req.params;
    try {
        const member = await BoardGovernance.findByIdAndDelete(id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};