
var membersRoute=require('./controlRoute');
var adminRoute=require('./adminRoute');
var userRoute=require('./userRoute');
var homeRoute=require('./homeRoute');
var apiRoute=require('./apiRoute');

module.exports=function(app){
    
  app.use('/user',userRoute)    
  app.use('/admin',adminRoute)    
  app.use('/control',membersRoute);
  app.use('/',homeRoute);

    app.use('/api/v1',apiRoute)    

}



