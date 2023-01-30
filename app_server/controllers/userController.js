const User =require('../models/user');
const url = require('url');
const addMonths = require('addmonths');
const { json } = require('body-parser');

module.exports.index=function(req,res){

  if(res.locals.session.role !=="user" ){
    res.redirect('/');
  }
  else
  {
    res.render('user/index', {layout: "user/layout"})
  }
}



  module.exports.products=function(req,res){
    if(res.locals.session.role !=="user"){
      res.redirect("/")
    }
    else{
      res.render('user/products',{layout: "user/layout"});
    }
  }


 

  module.exports.productssite=function(req,res){
    if(res.locals.session.role !=="user"){
      res.redirect("/")
    }
    else{
      res.render('user/productssite',{layout: "user/layout"});
    }
  }




  module.exports.setting=function(req,res){
    if(res.locals.session.role !=="user"){
      res.redirect("/")
    }
    else{
      res.render('user/setting',{layout: "user/layout"});
    }
  }




module.exports.anasayfa=function(req,res){
  if(res.locals.session.role !=="user" )
  {
    res.redirect('/')
  }else{
    
    addHisse.findOne({"symbol": req.params.symbol},function(err,user){
      var guncelle=true;
      if(user["anasayfa"]==true)
          guncelle=false;


    addHisse.findOneAndUpdate( {
      "symbol": req.params.symbol
        }, {
            "$set":  { "anasayfa": guncelle } 
        },
      
     function(err, users) {
      res.json({});
      })
    })
}
}



module.exports.tumanasayfafalse=function(req,res){
  if(res.locals.session.role !=="admin" )
  {
    res.redirect('/')
  }else{
    
    addHisse.updateMany( {
   
    }, {
        "$set":  { "anasayfa": false } 
    },
    
    function(err, users) {
    res.json({});
    })
}
}





module.exports.aktif=function(req,res){
  if(res.locals.session.role !=="admin" )
  {
    res.redirect('/')
  }else{
    
    addHisse.findOne({"symbol": req.params.symbol},function(err,user){
      var guncelle=true;
      if(user["aktif"]==true)
          guncelle=false;


    addHisse.findOneAndUpdate( {
      "symbol": req.params.symbol
        }, {
            "$set":  { "aktif": guncelle } 
        },
      
     function(err, users) {
      res.json({});
      })
    })
}
}

