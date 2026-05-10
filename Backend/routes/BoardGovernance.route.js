import express from 'express';
import { createBoardMember, deleteBoardMember, getBoardMembers, updateBoardMember } from '../controller/BoardGovernance.Controller.js';

const BoardGovernancerouter = express.Router();

BoardGovernancerouter.get('/', getBoardMembers);
BoardGovernancerouter.post('/', createBoardMember);
BoardGovernancerouter.put('/:id', updateBoardMember);
BoardGovernancerouter.delete('/:id',deleteBoardMember);

export default BoardGovernancerouter;