import express from 'express';
import { createTeamMember, deleteTeamMember, getTeamMemberById, getTeamMembers, updateTeamMember } from '../controller/OurTeam.Controller.js';

const OurTeamrouter = express.Router();

// Routes for /api/team
OurTeamrouter.route('/')
    .get(getTeamMembers)       // Fetch all members
    .post(createTeamMember);   // Add a new member

// Routes for /api/team/:id
OurTeamrouter.route('/:id')
    .get(getTeamMemberById)    // Fetch one member by ID
    .put(updateTeamMember)     // Update a member's details
    .delete(deleteTeamMember); // Remove a member

export default OurTeamrouter;