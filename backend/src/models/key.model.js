const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
  equipmentName: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: [100, 'Equipment name cannot exceed 100 characters']
  },
  memberName: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true,
    maxlength: [100, 'Member name cannot exceed 100 characters'],
    default: 'Not Assigned'
  },
  bookingDateTime: {
    type: String,
    required: [true, 'Booking date time is required'],
    trim: true
  },
  keyStatus: {
    type: String,
    required: [true, 'Key status is required'],
    enum: {
      values: ['available', 'issued', 'returned'],
      message: 'Key status must be either: available, issued, or returned'
    },
    default: 'available'
  },
  issuedBy: {
    type: String,
    trim: true,
    maxlength: [100, 'Issued by name cannot exceed 100 characters']
  },
  issuedDateTime: {
    type: String,
    trim: true
  },
  returnedDateTime: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
keySchema.index({ equipmentName: 1 });
keySchema.index({ keyStatus: 1 });
keySchema.index({ memberName: 1 });

const Key = mongoose.model('Key', keySchema);

module.exports = Key;
