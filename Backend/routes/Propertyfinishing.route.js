import express from 'express';
import { 
    saveContact, 
    getAllContacts, 
    getContactById, 
    updateContact, 
    deleteContact 
} from '../controller/Propertyfinishing.Controller.js';

const Propertyfinishingrouter = express.Router();

// Route for operations on the entire collection
Propertyfinishingrouter.route('/save-service-contact')
    .post(saveContact)      // Create
    .get(getAllContacts);   // View All

// Route for operations on a specific contact by ID
Propertyfinishingrouter.route('/save-service-contact/:id')
    .get(getContactById)    // Single View
    .put(updateContact)     // Update
    .delete(deleteContact); // Delete

export default Propertyfinishingrouter;