import mongoose from 'mongoose';

const PropertyrentalSchema = new mongoose.Schema({
 role: { type: String, enum: ['مؤجر', 'مستأجر'], required: true },
    
    // Checkbox / Dropdown Selection for Property Type
    propertyType: { type: String }, 
    
    location: { type: String, required: true },
    developer: { type: String },
    area: { type: String },
    rooms: { type: String },
    bathrooms: { type: String },
    age: { type: String },
    
    // Price Checkbox Logic
    priceLimit: { type: String }, // Value if 'حد السعر' is checked
    priceOffer: { type: String }, // Value if 'على السوم' is checked
    
    // New: Store which price checkboxes were actually ticked
    priceSelectionTypes: {
        isLimit: { type: Boolean, default: false },
        isOffer: { type: Boolean, default: false }
    },

    notes: { type: String },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    
    // Contact Channel Checkboxes
    channels: {
        chat: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: true },
        call: { type: Boolean, default: false }
    },
    
    media: [{ 
        filename: String, 
        path: String,
        mimetype: String
    }],
    createdAt: { type: Date, default: Date.now }
});

const Propertyrental = mongoose.model('Propertyrental', PropertyrentalSchema);
export default Propertyrental;