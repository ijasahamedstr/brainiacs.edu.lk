import express from 'express';
import { 
    saveRequest, 
    getAllRequests, 
    getRequestById, 
    updateRequest, 
    deleteRequest 
} from '../controller/Buyingproperty.Controller.js';

const Buyingpropertyrouter = express.Router();

/**
 * @description Routes for handling the collection
 * POST: /api/buying/save
 * GET:  /api/buying/save
 */
Buyingpropertyrouter.route('/save')
    .post(saveRequest)      // CREATE
    .get(getAllRequests);   // VIEW ALL

/**
 * @description Routes for handling specific items by ID
 * GET:    /api/buying/save/:id
 * PUT:    /api/buying/save/:id
 * DELETE: /api/buying/save/:id
 */
Buyingpropertyrouter.route('/save/:id')
    .get(getRequestById)    // SINGLE VIEW
    .put(updateRequest)     // UPDATE
    .delete(deleteRequest); // DELETE

export default Buyingpropertyrouter;