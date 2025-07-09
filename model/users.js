const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
          image:{
                        type : String,
                    },     
              
          name: {
                    required: true,
                    type:String,
                    trim:true

          },
          email: {
                    required: true,
                    type:String,
                    trim:true,
                    validate:{
                              validator:(value)=>{
                                        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                        return value.match(re);
   
                              },
                              message : 'Please enter a valid email address'
                    }
          },
          password : {
                    required : true,
                    type : String,
                    validate:{
                              validator:(value)=>{

                                        return value.length > 6;
   
                              },
                              message : 'Please enter al long password'
                    }
          },

          role : {
                    type: String,
                    enum: ['user', 'admin'],
                    default:"user"
          },
          productsPosted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
          }],
        
          subscription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subscription'
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
          
});
const Users = mongoose.model('User',userSchema);
module.exports = Users;