import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    count: {
        type: Number,
        required: [true, 'Count is required'],
        min: [0, 'Count cannot be a negative number']
    },
    suffix: {
        type: String,
        default: '+',
        trim: true
    },
    icon: {
        type: String,
        default: '',
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Stat', statSchema);