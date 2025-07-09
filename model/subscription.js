const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  price: {
          type: Number,
          default: 0
  },
  durationInDatys:{
          type: Number,
          default: 30
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productLimit: {
          type: Number,
          default:3
  },
  canPinProduct:{
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String, // stripe, manual, gumroad...
    default: 'manual'
  }
});
const Subscription = mongoose.model('Subscription',subscriptionSchema);
module.exports = Subscription;