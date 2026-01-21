import mongoose from 'mongoose';

const PropertyforsaleSchema = new mongoose.Schema({
propertyStatus: String,
  propertyType: String,
  location: String,
  developer: String,
  area: String,
  rooms: String,
  bathrooms: String,
  propertyAge: String,
  priceLimit: String,
  priceOffer: String,
  isNegotiable: String,
  notes: String,
  contactChannels: {
    chat: Boolean,
    whatsapp: Boolean,
    call: Boolean
  },
  clientName: String,
  clientMobile: String,
  files: [{
    fileName: String,
    filePath: String,
    fileType: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Propertyforsale = mongoose.model('Propertyforsale', PropertyforsaleSchema);
export default Propertyforsale;