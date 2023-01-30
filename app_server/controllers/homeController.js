const store=require('store')
module.exports.index=function(req,res){
    console.log(store.role)
    if(store.get('role')=="admin" || store.get('role')=="personelMd" )
    {
    res.redirect('/admin')
    }
    else
    {
        res.render('control/login',{hata:""});
    }
    }
   