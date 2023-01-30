const User =require('../models/user');
const url = require('url');
const addMonths = require('addmonths');
const { json } = require('body-parser');

module.exports.index=function(req,res){

  if(res.locals.session.role !=="admin" ){
    res.redirect('/');
  }
  else
  {
    res.render('admin/index', {layout: "admin/layout"})
  }
}


  module.exports.users=function(req,res){
    if(res.locals.session.role !=="admin" ){
      res.redirect("/")
    }
    else{
      res.render('admin/users',{layout: "admin/layout"});
    }
  }




  module.exports.products=function(req,res){
    if(res.locals.session.role !=="admin"){
      res.redirect("/")
    }
    else{
      res.render('admin/products',{layout: "admin/layout"});
    }
  }


 

  module.exports.productadd=function(req,res){
    if(res.locals.session.role !=="admin"){
      res.redirect("/")
    }
    else{
      res.render('admin/productadd',{layout: "admin/layout2"});
    }
  }


  module.exports.usersadd=function(req,res){
    if(res.locals.session.role !=="admin"){
      res.redirect("/")
    }
    else{
      res.render('admin/usersadd',{layout: "admin/layout2"});
    }
  }



module.exports.anasayfa=function(req,res){
  if(res.locals.session.role !=="admin" )
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

