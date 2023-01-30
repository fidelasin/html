var mongoose =require('mongoose');
mongoose.Promise =require('bluebird');

//var mongoDB="mongodb+srv://fidelasin:ql3Jio43PbTHCY9P@cluster0.pywiz.mongodb.net/kurs?retryWrites=true&w=majority";
var mongoDB="mongodb://localhost:27017/productPanel";

mongoose.connect(mongoDB,{},(err) => {
    if(err) console.log(err) 
    else
    console.log("MongoDB connected!");
  });
