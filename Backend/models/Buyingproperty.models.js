import mongoose from 'mongoose';

const BuyingpropertySchema = new mongoose.Schema({
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
  paymentMethod: String,
  notes: String,
  name: String,
  mobile: String,
  channels: {
    chat: Boolean,
    whatsapp: Boolean,
    call: Boolean
  },
  createdAt: { type: Date, default: Date.now }
});

// Changed from module.exports to export default
const Buyingproperty = mongoose.model('Buyingproperty', BuyingpropertySchema);
export default Buyingproperty;