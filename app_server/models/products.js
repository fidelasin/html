const mongoose = require('mongoose');

        const productsSchema = new mongoose.Schema({
            title: { type: String},
            description: { type: String},
            brand: { type: String},
            weight : { type: String},
            itemModelNumber: { type: String},
            size: { type: String},
            numberOfİtem: { type: String },
            quantity: { type: String},
            price: { type: String},
            batteriesRequired: { type: String},
            itemWeight: { type: String},
            gtin: { type: String},
            ean: { type: String},
            added: { type: String},
            stock: { type: Number},
            
            color: { type: Array},
            productDimensions: { type: Array},
            material: { type: Array},
            type: { type: Array},
            pictures: { type: Array},
            video: { type: Array},
            status: Boolean,
            date: {
             type: Date,
             default: Date.now
            }
           }) 
        
         module.exports = mongoose.model('products', productsSchema);
 