var mongoose =require('mongoose');

var Schema= mongoose.Schema;


var userSchema = new Schema({
    name: { type: String, required:true},
    surname: { type: String, required:true},
    email: String ,
    password: { type: String, required:true},
    telefon:{ type: String, required:true},
    role: String,
   
    token: String,
    bearertoken: String,
    password_link: String,
    durum: Boolean
});

var User=mongoose.model('User',userSchema);
module.exports=User;     