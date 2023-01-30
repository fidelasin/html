var User =require('../models/control');
const mongoose = require('mongoose');
const Auth = mongoose.model('User');
const store=require('store')

module.exports.login=function(req,res){
   if(store.get('login')=="ok" )
  {
	res.redirect('/')
  }
  else
  {res.render('control/login',{hata:""})}
  
}

module.exports.loginPost=function(req,res){
console.log(req.body)
console.log(store.get('login'))
console.log(store.get('userId'))
console.log(store.get('role'))
console.log(store.get('bearertoken')) 
console.log(store.get('telefon'))
  if(store.get('login')=="ok" )
  {

      res.redirect('/')
   
  }
  else
  {
    if(req.body.telefon=="" || req.body.password==""){
      res.render('control/login',{hata:"Telefon veya sifre boş bırakılamaz"})
    }
    else 
    {
			
      Auth.findOne({telefon:req.body.telefon,password:req.body.password}, function (err1, user) {
        if (user) {
          console.log("user.role"+user.role)

          tokens=generateToken(64);
          if ( req.body.remember ) {
            var maxAge_ = 30 * 24 * 3600000;
            res.cookie('token',tokens, { maxAge: maxAge_, httpOnly: true });
          
          } else {
            req.session.cookie.expires = false;
          }  
          
         
          Auth.updateOne({_id:user._id},{token:tokens},function(err,userss){if(userss){console.log("guncellendi")}})
          console.log("user.role"+user.role)
          store.set('login', "ok")
          store.set('userId', user._id)
          store.set('role', user.role)  
          store.set('name', user.name)
          store.set('surname', user.surname)
          store.set('telefon', user.telefon)
          store.set('bearertoken', user.bearertoken)
            res.locals.session.userId = user._id;
            res.locals.session.role = user.role;
            res.locals.session.name = user.name;
            res.locals.session.surname = user.surname;
            res.locals.session.telefon = user.telefon;
            res.locals.session.bearertoken = user.bearertoken;
            if(user.role=="admin"){  
            res.redirect('/admin');
          }
          else if(user.role="user"){
            res.redirect('/user')
          }
          else if(user.role="personel"){
            res.redirect('/personel')
          }
          else if(user.role="ogrenci"){
            res.redirect('/ogrenci')
          }
          else
          {res.redirect('/');}
         
         

        }
        else {
          req.session.destroy();
          res.render('control/login',{hata:"yeterKullanıcı adı Veya Şifreniz Hatalı"})
        }
      });
    }

  }
} 

module.exports.signup=function(req,res){
  if(store.get('login')=="ok" )
  {res.redirect('/')}
  else
  {
  res.render('control/signup')
  }
}


module.exports.signupPost=function(req,res){
  if(store.get('login')=="ok" )
  {res.redirect('/')}
  else
  {
  req.session.sayi= Math.floor(Math.random() * (999998 - 100001)) + 100001;
  req.session.name=req.body.ad;
  req.session.surname=req.body.soyad;
  req.session.email=req.body.email;
  req.session.telefon=req.body.telefon;
  req.session.tc=req.body.tc;
  req.session.password=req.body.sifre;
  req.session.bearertoken=req.body.bearertoken;

  if(req.body.ad !==""&&req.body.soyad!==""&&req.body.email!==""&&req.body.tc!==""&&req.body.sifre!=="")
  {
    const nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'asiwahilda@gmail.com',
          pass: 'azloxayaswjfdwaw',
        },
      });

      transporter.sendMail({
        from: '"Falanca Şirket" <sirketinfo@memet.com>',
        to: req.session.email, 
        subject: "Mesaj basligi",
        html: "<b>doğrulama kodunuz: "+req.session.sayi+"</b>", 
      }).then(info => {
        res.render('control/verifity');
      }).catch(console.error);
    }
    else
    {
      
    }
  }
}

module.exports.verifityPost=function(req,res){
  if(store.get('login')=="ok" )
  {res.redirect('/')}
  else
  {
  if(req.body.verifity==req.session.sayi)
  {
            var newUser=new User({
              name: req.session.name,
              surname: req.session.surname,
              email: req.session.email,
              tc:req.session.tc,
              telefon:req.session.telefon,
              password:req.session.password,
              bearertoken:req.session.bearertoken,
              password_link:"",
              token:"",
              role:"user",
            });
            
   newUser.save(function(err){
      if(err)
      {
        console.log(err);
        res.redirect('/control/signup');
      }
      else
      {
        req.session.destroy(); 
        res.redirect('/control/signupOk');
        
      
      }
   });
 
  }
  }
  
  /*
  Auth.findOne({email:req.session.email},function(err,user){
    if(user)
    {
      console.log(req.body.verifity);
        console.log(user.verifity);
      if(req.body.verifity==user.verifity)
      {
        Auth.updateOne({_id:user._id},{emailOnay:"1"},function(err,user){if(user){console.log("guncellendi")}});
        res.redirect('/control/login');
        req.session.destroy();
      }
      else
      {

      }
    }
  })
  */
}
 
module.exports.signupOk=function(req,res){
  res.render('control/signupOk')
}
  
module.exports.forget=function(req,res){
  
  if(store.get('login')=="ok" )
 {res.redirect('/')}
 else
 {
  res.render('control/forget',{hata:""})
 }
 
}

module.exports.forgetPost=function(req,res){
  
  if(store.get('login')=="ok" )
 {res.redirect('/')}
 else
 {
    
  if(req.body.email)
  {
   Auth.findOne({email:req.body.email},function(err,user){
     if(user){
       password_link_=generateToken(32);
              Auth.updateOne({_id:user._id},{password_link:password_link_},function(err,users){
                if(users){
                  
                  const nodemailer = require('nodemailer');

                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'asiwahilda@gmail.com',
                      pass: 'Mem123mem',
                    },
                  });
  
                  transporter.sendMail({
                    from: '"Şifremi Unuttum" <sirketinfo@memet.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Şifremi Unuttum", // Subject line
                  // text: "There is a new article. It's about sending emails, check it out!", // plain text body
                    html: "<b>Link: http://127.0.0.1:8003/control/newpassword/"+password_link_+"</b>", // html body
                  }).then(info => {
                    res.render('control/forget',{mesaj:"Mail onayı gönderildi Postanızı Kontrol ediniz"});
                  }).catch(console.error);
                }

              })
              
              }
              else
              {
                
              }
            
     
   })
  }
 }
 
}
module.exports.newpassword=function(req,res){
  if(store.get('login')=="ok" )
  {res.redirect('/')}
  else
  {
  Auth.findOne({password_link:req.params.id},function(err,user){
    if(user){
      res.render('control/newpassword',{deger:req.params.id})
    }
    else
    {
      res.render('control/newpassword',{deger:"hata"})
    }
  })
}
}

module.exports.newpasswordPost=function(req,res){
  if(store.get('login')=="ok" )
 {res.redirect('/')}
 else
 {
  if(req.body.password===req.body.passwordre){
    Auth.updateOne({password_link:req.body.password_link_},{password:req.body.password},function(err,user){
      if(err){
        res.render('control/newpassword',{deger:req.params.id,hata:"Beklenmedik Bir Hata oluştu"})
      }else{
        res.render('control/newpassword',{mesaj:"Başarılı Bir şekilde Şifreniz Değişti"})
      }
    })
  }
  else
  {
    res.render('control/newpassword',{deger:req.body.password_link_,hata:"Şifreniz Aynı değil"})
  }
}
}


module.exports.cikis=function(req,res){
  req.session.destroy();
  res.clearCookie("token");
  store.clearAll()

  res.redirect('/')
}
  
function generateToken(n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = '';
  for(var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}