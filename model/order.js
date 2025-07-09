const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
     product: [{
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "Product",
                 required: true
               }],   
     buyer: [{
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "User",
                 required: true
               }], 
     seller: [{
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "User",
                 required: true
               }],
     type:{
                    type: String,
                    enum: ["local", "digital"],
                    required: true
               },
     status:{
          type: String,
          enum: ['pending', 'viewed', 'confirmed'],
          default: 'pending'
     },
     createdAt: {
          type: Date,
          default: Date.now
     }

});

const Order = mongoose.model('Order',orderSchema);
module.exports = Order;