import express from 'express';
import multer from "multer";
import { 
    createServiceRequest, 
    getAllRentalRequests, 
    getRentalRequestById, 
    updateRentalRequest, 
    deleteRentalRequest 
} from '../controller/Propertyrental.Controller.js';
import os from 'os';

const Propertyrentalrouter = express.Router();

// Storage Config - Compatible with Vercel (/tmp) and Local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use /tmp for Vercel, or 'uploads' folder for Local
        const dest = process.env.NODE_ENV === 'production' ? os.tmpdir() : 'uploads/';
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

Propertyrentalrouter.route('/submit')
    .post(upload.array('media', 10), createServiceRequest) 
    .get(getAllRentalRequests);      // VIEW ALL: Get list of all requests

Propertyrentalrouter.route('/submit/:id')
    .get(getRentalRequestById)       // SINGLE VIEW: Get one request details
    .put(upload.array('media', 10), updateRentalRequest) 
    .delete(deleteRentalRequest);    // DELETE: Remove a request

export default Propertyrentalrouter;