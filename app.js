var express =require("express")
var path=require('path');
const store=require('store')
const dotenv = require('dotenv');
dotenv.config();

var app= express()
const session=require('express-session');
const db=require('./app_server/models/db');

var cookieParser = require('cookie-parser');
app.use(cookieParser());
ejsLayouts=require('express-ejs-layouts');

const port = process.env.PORT;
const secret_key = process.env.secret_key;


var bodyParser = require('body-parser')

app.use(session({
    secret: secret_key,
    resave: false,
    saveUninitialized: true
    }));

app.use(function(req,res,next){
    res.locals.session = {}; //localstorage session ata
   //res.locals.cookie=req.cookies;//localstorage cookide yaz
 
       if(typeof(store.get('login')) ==="undefined")  //localstorage kontrol et girmismi maksat tekrar sorgu atmasın
       { 
         if(req.cookies.token){  //token cookie varsa devam
           const User =require('./app_server/models/control');
           const mongoose = require('mongoose');
           const Auth = mongoose.model('User');
         Auth.findOne({token:req.cookies.token}, function (err1, user) {
           if (user) {
             store.set('login', "ok")
             store.set('userId', user._id)
             store.set('role', user.role)
             store.set('name', user.name)
             store.set('surname', user.surname)
             store.set('email', user.email)
             store.set('bearertoken', user.bearertoken)
             res.locals.session.login="ok";
             res.locals.session.userId = user._id;
             res.locals.session.role = user.role;
             res.locals.session.name = user.name;
             res.locals.session.surname = user.surname;
             res.locals.session.email = user.email;
             res.locals.session.bearertoken = user.bearertoken;
           }  
             
             
           });
         }
 
         }
         else
         {
           res.locals.session.login=store.get('login');
           res.locals.session.userId = store.get('userId');
           res.locals.session.role = store.get('role');
           res.locals.session.name = store.get('name');
           res.locals.session.surname = store.get('surname');
           res.locals.session.email = store.get('email');
           res.locals.session.bearertoken = store.get('bearertoken');
         }
 
         console.log("res.locals.session.bearertoken"+res.locals.session.bearertoken)

   next();
 });
 
 
 app.set('view engine','ejs');
 app.set('views',path.join(__dirname,'/app_server/views'));
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());
 app.use(ejsLayouts);
 app.use('/public',express.static(path.join(__dirname,'public')))


 app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});


      app.use(function(req, res, next) {
        require('./app_server/routes/managerRoute')(app);
      next();
      });
      const swaggerUI = require('swagger-ui-express');
      swaggerDocument = require('./swagger.json');
      app.use('/swg', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port);
