import OurTeam from "../models/OurTeam.models.js";


// @desc    Get all team members
export const getTeamMembers = async (req, res) => {
    try {
        const members = await OurTeam.find().sort({ createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single team member
export const getTeamMemberById = async (req, res) => {
    try {
        const member = await OurTeam.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new team member
export const createTeamMember = async (req, res) => {
    try {
        const newMember = await OurTeam.create(req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a team member
export const updateTeamMember = async (req, res) => {
    try {
        const updatedMember = await OurTeam.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        if (!updatedMember) return res.status(404).json({ message: "Member not found" });
        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a team member
export const deleteTeamMember = async (req, res) => {
    try {
        const member = await OurTeam.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};