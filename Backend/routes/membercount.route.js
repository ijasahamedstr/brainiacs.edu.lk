import express from 'express';
import { 
    getStats, 
    getStatById,
    updateStat,
    deleteStat,
    bulkUpdateStats,
    bulkDeleteStats,
    createStat
} from '../controller/membercount.Controller.js';

const membercountrouter = express.Router();

// ==========================================
// 1. STATIC & BULK ROUTES (Must come before /:id)
// ==========================================

membercountrouter.get('/', getStats);
membercountrouter.post('/seed', createStat);
membercountrouter.put('/bulk-update', bulkUpdateStats);
membercountrouter.delete('/bulk-delete', bulkDeleteStats);

// ==========================================
// 2. DYNAMIC ROUTES (/:id)
// ==========================================

membercountrouter.route('/:id')
    .get(getStatById)
    .put(updateStat)
    .delete(deleteStat);

export default membercountrouter;