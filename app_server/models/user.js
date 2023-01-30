const mongoose = require('mongoose');

        const userSchema = new mongoose.Schema({
          name: { type: String},
          surname: { type: String},
          email:  { type: String},
          password: { type: String},
          telefon:{ type: String, required:true,unique:true},
          site:{ type: String, },
          //exchange:{  type: Array},
          order: [
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
            }], 

            product: [
              {
                send:{type: Boolean, default:false},
                siteid:{type: String, default:"0"},
                productid: {type: String, required: false,unique:true},
                date: {
                  type: Date,
                  default: Date.now
                 }   
              }], 
              siteattributes: [
                {
                  attributes: {type: String, required: false},
                  attributesid: {type: String, required: false}
                }], 
              sitecategory: [
                {
                  category: {type: String, required: false},
                  categoryid: {type: String, required: false}
                }], 
          soru: [
            {
              _id: false,
              soru: {type: String, required: false},
              sorukodu: {type: String, required: false}
            }], 
          sorutek: [
              {
                _id: false,
                soru: {type: String, required: false},
                cevap: {type: String, required: false},
                sorukodu: {type: String, required: false}
              }],         
          bearertoken:String,
          role: String,
          token: String,
          password_link: String,
          status: Boolean,
          code: String,
          ip: String,
          ck: String,
          cs: String,
           date: {
             type: Date,
             default: Date.now
            },


           }) 
        
         module.exports = mongoose.model('Users', userSchema);
 