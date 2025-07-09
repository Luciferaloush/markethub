const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
          title: {
                    type: String,
                    require: [true, "Product title is required"],
          },
          description: {
                    type: String,
                    require: [true, "Product description is required"],
          },
          price: {
                    type: Number,
                    require: [true, "Product price is required"],
                    min:0
          },
          category: {
                    type: String,
                    require: true
          },
          type: {
                    type: String,
                    require: true,
                    enum: ['digital', 'local']
          },
          cover:{
              type: String,
              require: true,      
          },
          images:{
              type: [String],
              default: []
          },
          fileUrl:{
                    type: String,
          },
          location: {
                    type: String
          },
          conactInfo:{
                    type: String
          },
          owner:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
          },
          isApproved: {
                    type: Boolean,
                    default: true
          },
          idPinned: {
            type: Boolean,
            default: false
          }

},
{timestamps: true}
);
          const Product = mongoose.model('Product',productSchema);
          module.exports = Product;