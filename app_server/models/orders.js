const mongoose = require('mongoose');

        const orderSchema = new mongoose.Schema(
            {
              order: {type: Boolean, required: false},
              name: {type: String, required: false},
              address: {type: String, required: false},
              phone: {type: String, required: false},
              ean: {type: String, required: false},
              customerprice: {type: String, required: false},
              customerpiece: {type: String, required: false},
              price: {type: String, required: false},
              date: {
                type: Date,
                default: Date.now
               }   
            }) 
        
         module.exports = mongoose.model('Order', orderSchema);
 