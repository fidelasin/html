const mongoose = require('mongoose');
const url = require("url");
const WooCommerceAPI = require("woocommerce-api");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const User =require('../models/user');
const Products =require('../models/products');
const dotenv = require('dotenv');
dotenv.config();
const secret_key = process.env.secret_key;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//const addMonths = require('addmonths');
//const { json } = require('body-parser');
//const store=require('store')
const jwt =require('jsonwebtoken')
const redis=require('redis');
const user = require('../models/user');
const client=redis.createClient();



module.exports.wooProductsSend =async function(req,res){
  const id =req.params.id
  const bearertoken = req.headers.authorization.split(" ")[1];
 console.log(id)
 console.log(bearertoken)
    User.findOne({ "bearertoken":bearertoken },['sitecategory',"ck","cs","site","siteattributes"],async function(err, user) {
    if (err)  return await  res.send(err);
    if(user === null) return  await res.json(JSON.parse('{"mesaj":"Yetkisiz"}'))
    else
    {
     category=[]
      Products.findOne( {"_id":id },{},{ },async (err, product)=>  {
          product.type.forEach(element => {
            user.sitecategory.forEach(site => {
                if(element===site.category){
                  console.log(site.category)

                  category.push({"id":site.categoryid})
                }
            });

            pictures=[]
            product.pictures.forEach(element => {
              pictures.push({"src":element})
            });
          });


          site="https://"+user.site
          const WooCommerce = new WooCommerceRestApi({
            url: site, 
            consumerKey: user.ck, 
            consumerSecret: user.cs,
            version: 'wc/v3'
          });
    
          attributesName="Color";
          term=["blue","redd"];


          const attributesid= await  GetAttributes(user,attributesName)
          console.log("attributesid"+attributesid)

          await productTerms(attributesid,WooCommerce,"blue")
          await productTerms(attributesid,WooCommerce,"redd")

          const postid= await  productPost(product,WooCommerce,term)
          console.log("postid"+postid)

          await  productVariations(postid,attributesName,WooCommerce,"blue","15")
          await  productVariations(postid,attributesName,WooCommerce,"redd","17")
          //await update(postid,WooCommerce,term)
      })
    }
  })
  return  await res.json("user.product.productid")
     
 }
 
 async function update(postid,WooCommerce,term)
 {

  const data = {
    "attributes" :[
      {
        name:"Color",
				position : 0,
        visible : true,
        variation: true,
        options: term
      }
    ]
      
  };
  
  WooCommerce.put("products/"+postid, data)
    .then((response) => {
      console.log("update");
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
  
}

 async function productTerms(attributesid,WooCommerce,term)
 {

 const data = {
  name: term
  };

  WooCommerce.post("products/attributes/"+attributesid+"/terms", data)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}


 async function GetAttributes(user,attributesName)
 {


    id="0";
       user.siteattributes.forEach(element => {
          attributes=element.attributes
          attributesid=element.attributesid

            
            if(attributes===attributesName)
                 {
                  console.log("attributes"+attributes)
                  id=attributesid
                 } 
        });

     return id;
 }
 async function productPost(product,WooCommerce,term)
 {
  postid = "0";
  const data = {
    name: product.title,
    type: "variable",
    regular_price: product.price,
    description: product.description,
    short_description: product.description,
    categories: category,
    attributes :[
      {
        name:"Color",
				position : 0,
        visible : true,
        variation: true,
        options: term
      }
    ],

    images: [
      {
        src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg"
      },
      {
        src: "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg"
      }
    ]
  };
  
  await WooCommerce.post('products', data).then(async function(result) {
    postid=result.data.id
  });
  return await postid;
 }

 async function productVariations(postid,attributesName,WooCommerce,term,price)
 {

  
    const  data = {
      regular_price: price,
      attributes: [
        {
          name: attributesName,
          option: term
        }
      ]
    };
  
      WooCommerce.post("products/"+postid+"/variations", data)
        .then((response) => {
          console.log("");
          console.log("varyasyon yazılıyor");
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
  


}

 
 module.exports.wooProductsCreateAttributes =async function(req,res){
  const attributes =req.body.attributes
  const bearertoken = req.headers.authorization.split(" ")[1];

  
  User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, user) {
    if (err)  return await  res.send(err);
    if(user === null) return  await res.json(JSON.parse('{"mesaj":"Yetkisiz"}'))
    else
    {
      site="https://"+user.site
      const WooCommerce = new WooCommerceRestApi({
        url: site, 
        consumerKey: user.ck, 
        consumerSecret: user.cs,
        version: 'wc/v3'
      });
      attributes.forEach(element => {
      const data = {
        name: element,
        type: "select",
        has_archives: true
      };
      WooCommerce.post("products/attributes", data)
        .then((response) => {
          console.log(response.data);
          User.findOneAndUpdate({"bearertoken":bearertoken   }, 
          { $push:{siteattributes:{"attributes":element,"attributesid":response.data.id,}}  },{ },async function(err, users) {
            if(err){
                console.log(err)
            }
          }); 
        })
        .catch((error) => {
          console.log(error.response.data);
        });
      });
    }
  })
  return  res.json(JSON.parse('{"mesaj":"ok"}'));
 }


 
 

 
module.exports.wooProductsCreateCategory =async function(req,res){
  const category =req.body.category
  const images =req.body.image
  console.log(category)
  const bearertoken = req.headers.authorization.split(" ")[1];
  User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, user) {
    if (err)  return await  res.send(err);
    if(user === null) return  await res.json(JSON.parse('{"mesaj":"Yetkisiz"}'))
    else
    {

      site="https://"+user.site

      const WooCommerce = new WooCommerceRestApi({
        url: site, 
        consumerKey: user.ck, 
        consumerSecret: user.cs,
        version: 'wc/v3'
      });

      
      const data = {
        name: category,
        image: {
          src: images
        }
      
      };
      
      WooCommerce.post("products/categories", data)
        .then((response) => {
           User.findOneAndUpdate({"bearertoken":bearertoken   }, 
            { $push:{sitecategory:{"category":category,"categoryid":response.data.id,}}  },{ },async function(err, users) {
              if(err)
              return  res.json(JSON.parse('{"mesaj":"hata"}'));
              else
              return  res.json(JSON.parse('{"mesaj":"ok"}'));
            }); 

        })
        .catch((error) => {
          console.log(error.response.data);
          return  res.json(JSON.parse('{"mesaj":"hata"}'));

        });
      
    }
  })



     
 }

module.exports.wooProductsDelete =async function(req,res){
  const id =req.params.id
  const bearertoken = req.headers.authorization.split(" ")[1];
 
    User.findOneAndUpdate({"bearertoken":bearertoken ,"product.productid":id   }, 
    { $pull:{product:{"productid":id}}  },{ safe: true},async function(err, users) {
      if(err)
      return await res.json(JSON.parse('{"mesaj":"hata"}'));
      else
      return await res.json(JSON.parse('{"mesaj":"ok"}'));
    }); 
     
 }

module.exports.wooProductsAdd =async function(req,res){
  const productid =req.params.id
  const bearertoken = req.headers.authorization.split(" ")[1];
  User.findOne( {"bearertoken":bearertoken,"product.productid":productid },{},{ },async function(err, user) {
    if (err){
      res.json(JSON.parse('{"mesaj":"urunvar"}'));
      return await  res.send(err);
    }  
    console.log(user)
    if(user !== null) {
      return await  res.json(JSON.parse('{"mesaj":"ekli"}'));
    }else{
      await User.findOneAndUpdate({"bearertoken":bearertoken}, { $push:{ "product" :{"productid": productid}}  },{upsert:true});
    }
   
    return  await res.json(JSON.parse('{"mesaj":"ok"}'));
  })
     
 }
 module.exports.productUserGetAll =async function(req,res){

  const queryObject = url.parse(req.url,true).query;
      const  start=Number(queryObject.start);
      const length=Number(queryObject.length);
      var draw=queryObject["draw"];
      var searchValue=queryObject["search[value]"];
  
      console.log("searchValue"+searchValue)
      if(searchValue==undefined) searchValue="";
      console.log("searchValue"+searchValue)
  
        let countData="0";
  
  
     const bearertoken = req.headers.authorization.split(" ")[1];
  
     let productList=[];
     User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
      if(err) return await  res.json(JSON.parse('{"mesaj":"Hata"}'));
  
      if(users===null) { 
        return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
      }
      users.product.forEach(element => {
        productList.push(element.productid)
      });
      console.log(productList)

   let degerJson={};
   let deger=[];
     degerJson["__v"]=0;
    deger.push(degerJson);
  
    Products.find( { 
      $and: [{"_id" : {"$nin": productList}   } ],
      $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]
  
     },{},function(err, product) {
      countData = product.length;
     });
  
  
       Products.find( { 
        $and: [{"_id" : {"$nin": productList}  } ],
        $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]
  
       },{},{ 
         skip: start, 
         limit: length
       }, function(err, products) {
       var userMapBirlestir = [];
       var userMapTek = {};
       sirasi=start;
       
       products.forEach(function(product) {
         
         sirasi++;
         userMapTek = {};
         userMapTek["_id"] = product._id;
         userMapTek["sira"] = sirasi;
         userMapTek["title"] = product.title;
         userMapTek["brand"] = product.brand;
         userMapTek["price"] = product.price;
         userMapTek["ean"] = product.ean;
         userMapTek["gtin"] = product.gtin;
         userMapTek["stock"] = product.stock;
         userMapTek["button"] = '<button class="btn btn-primary productAdd" data-id="'+product._id+'" >Add</button>';
         userMapBirlestir.push(userMapTek);
         
       });
  
     const  userMap = {
      "draw":draw,
     "recordsTotal": countData,
     "recordsFiltered": countData,"data":userMapBirlestir};
     res.json(userMap);   
    });
  } );
   }
  

   module.exports.productUserGetAllSite =async function(req,res){

    const queryObject = url.parse(req.url,true).query;
        const  start=Number(queryObject.start);
        const length=Number(queryObject.length);
        var draw=queryObject["draw"];
        var searchValue=queryObject["search[value]"];
    
        console.log("searchValue"+searchValue)
        if(searchValue==undefined) searchValue="";
        console.log("searchValue"+searchValue)
    
          let countData="0";
    
    
       const bearertoken = req.headers.authorization.split(" ")[1];
    
       let productList=[];
       User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
        if(err) return await  res.json(JSON.parse('{"mesaj":"Hata"}'));
    
        if(users===null) { 
          return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
        }
        users.product.forEach(element => {
          productList.push(element.productid)
        });
        console.log(productList)
  
     let degerJson={};
     let deger=[];
       degerJson["__v"]=0;
      deger.push(degerJson);
    
      Products.find( { 
        $and: [{"_id" : {"$in": productList}   } ],
        $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]
    
       },{},function(err, product) {
        countData = product.length;
       });
    
    
         Products.find( { 
          $and: [{"_id" : {"$in": productList}  } ],
          $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]
    
         },{},{ 
           skip: start, 
           limit: length
         }, function(err, products) {
         var userMapBirlestir = [];
         var userMapTek = {};
         sirasi=start;
         
         products.forEach(function(product) {
           
           sirasi++;
           userMapTek = {};
           userMapTek["_id"] = product._id;
           userMapTek["sira"] = sirasi;
           userMapTek["title"] = product.title;
           userMapTek["brand"] = product.brand;
           userMapTek["price"] = product.price;
           userMapTek["ean"] = product.ean;
           userMapTek["gtin"] = product.gtin;
           userMapTek["stock"] = product.stock;
           userMapTek["button"] = '<button class="btn btn-primary productSend" data-id="'+product._id+'" >Send</button>';
           userMapBirlestir.push(userMapTek);
           
         });
    
       const  userMap = {
        "draw":draw,
       "recordsTotal": countData,
       "recordsFiltered": countData,"data":userMapBirlestir};
       res.json(userMap);   
      });
    } );
     }
  
     
module.exports.productGetAll =async function(req,res){

const queryObject = url.parse(req.url,true).query;
    const  start=Number(queryObject.start);
    const length=Number(queryObject.length);
    var draw=queryObject["draw"];
    var searchValue=queryObject["search[value]"];

    console.log("searchValue"+searchValue)
    if(searchValue==undefined) searchValue="";
    console.log("searchValue"+searchValue)

      let countData="0";


   const bearertoken = req.headers.authorization.split(" ")[1];

   
   User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await  res.json(JSON.parse('{"mesaj":"Hata"}'));

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
   } );

 let degerJson={};
 let deger=[];
   degerJson["__v"]=0;
  deger.push(degerJson);

  Products.find( { 
    $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]

   },{},function(err, users) {
    countData = users.length;
   });


     Products.find( { 
      $or: [{brand:{ $regex: '.*' + searchValue + '.*' }},{title:{ $regex: '.*' + searchValue + '.*' }},{description:{ $regex: '.*' + searchValue + '.*' }},{ean:{ $regex: '.*' + searchValue + '.*' }},{gtin:{ $regex: '.*' + searchValue + '.*' }}]

     },{},{ 
       skip: start, 
       limit: length
     }, function(err, users) {
     var userMapBirlestir = [];
     var userMapTek = {};
     sirasi=start;
     
     users.forEach(function(user) {
       
       sirasi++;
       userMapTek = {};
       userMapTek["_id"] = user._id;
       userMapTek["sira"] = sirasi;
       userMapTek["title"] = user.title;
       userMapTek["brand"] = user.brand;
       userMapTek["price"] = user.price;
       userMapTek["ean"] = user.ean;
       userMapTek["gtin"] = user.gtin;
       userMapTek["stock"] = user.stock;
       userMapTek["button"] = '<button class="btn btn-primary orderModal" data-id="'+user.ean+'" id="detay" data-bs-toggle="modal" data-bs-target="#exampleModal">Detail</button>';
       userMapBirlestir.push(userMapTek);
       
     });

   const  userMap = {
    "draw":draw,
   "recordsTotal": countData,
   "recordsFiltered": countData,"data":userMapBirlestir};
   res.json(userMap);   
  });

 }

module.exports.productGet =async function(req,res){
   var ean =req.params.ean

   const bearertoken = req.headers.authorization.split(" ")[1];
    User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
     if(err) return await res.json('{"mesaj":"hata"}');  
 
     if(users===null) { 
       return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
     }

     Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {

      if(product ===null) {
        return res.json(JSON.parse('{"mesaj":"Urun bulunamadı"}'));
      }
      console.log(product)
      return res.json(product);
      } );
    } );
  }

module.exports.productGetStock =async function(req,res){
    var ean =req.params.ean
 
    const bearertoken = req.headers.authorization.split(" ")[1];
     User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
      if(err) return await res.json('{"mesaj":"hata"}');  
  
      if(users===null) { 
        return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
      }
 
      Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {
 
       if(product ===null) {
         return res.json(JSON.parse('{"mesaj":"Urun bulunamadı"}'));
       }
       return res.json(JSON.parse('{"stock":'+product.stock+'}'));
       } );
     } );
   }



module.exports.productDelete =async function(req,res){
  var ean =req.params.ean
  const role=req.userData.mrole
   if(role !== "admin")
   return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))

  const bearertoken = req.headers.authorization.split(" ")[1];
   User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json(JSON.parse('{"mesaj":"hata" }'))

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

    Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {
      if(product ===null) {
       return res.json(JSON.parse('{"mesaj":"Urun bulunamadı"}'));
     }

     Products.findOneAndDelete({"ean":ean },{},async (err, product)=>  {
      return await res.json(JSON.parse('{"mesaj":"basarili" }'))
     }
      )
     
     } );

     
     
   } );
 }


module.exports.productsEdit=async function(req,res){ 

  const role=req.userData.mrole
  if(role !== "admin")
  return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))

  const bearertoken = req.headers.authorization.split(" ")[1];
  const queryObject = req.body;
  const title=queryObject.title;
  const description=queryObject.description;
  const brand=queryObject.brand;
  const weight=queryObject.weight;
  const itemModelNumber=queryObject.itemModelNumber;
  const size=queryObject.size;
  const numberOfİtem=queryObject.numberOfİtem;
  const quantity=queryObject.quantity;
  const price=queryObject.price;
  const batteriesRequired=queryObject.batteriesRequired;
  const itemWeight=queryObject.itemWeight;
  const gtin=queryObject.gtin;
  const ean=queryObject.ean;
  const added=queryObject.added;
  const stock=queryObject.stock;
  const color=queryObject.color;
  const productDimensions=queryObject.productDimensions;
  const material=queryObject.material;
  const type=queryObject.type;
  const pictures=queryObject.pictures;
  const video=queryObject.video;
  const status=queryObject.status;
    User.findOne( {"bearertoken":bearertoken },{},{ },async (err, users)=>  {
    if(err) return res.json(JSON.parse('{"mesaj":"hata"}'))  
    if(users===null) { 
      return res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

    Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {

      if(product ===null) {
        return res.json(JSON.parse('{"mesaj":"Bulunamadi"}'));
      }
      else

      Products.findOneAndUpdate( {
        "ean": ean
          }, {
              "$set": {
                title: title,
                description: description,
                brand: brand,
                weight: weight,
                itemModelNumber: itemModelNumber,
                size: size,
                numberOfİtem: numberOfİtem,
                quantity: quantity,
                price: price,
                batteriesRequired: batteriesRequired,
                itemWeight: itemWeight,
                gtin: gtin,
                ean: ean,
                added: added,
                stock: stock,
                color: color,
                productDimensions: productDimensions,
                material: material,
                type: type,
                pictures: pictures,
                video: video,
                status:true
              }
          },function(err, product) {
            if(err)
            {
              console.log(err);
              return res.json(JSON.parse('{"mesaj":'+err+'}'));
            }else{
              return res.json(product);
            }
          })
    })


    });
}


module.exports.productsAdd=async function(req,res){ 
 

  const role=req.userData.mrole
  if(role !== "admin")
  return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))

  const bearertoken = req.headers.authorization.split(" ")[1];
  console.log("bearertoken"+bearertoken)


  const queryObject = req.body;
  const title=queryObject.title;
  const description=queryObject.description;
  const brand=queryObject.brand;
  const weight=queryObject.weight;
  const itemModelNumber=queryObject.itemModelNumber;
  const size=queryObject.size;
  const numberOfİtem=queryObject.numberOfİtem;
  const quantity=queryObject.quantity;
  const price=queryObject.price;
  const batteriesRequired=queryObject.batteriesRequired;
  const itemWeight=queryObject.itemWeight;
  const gtin=queryObject.gtin;
  const ean=queryObject.ean;
  const added=queryObject.added;
  const stock=queryObject.stock;
  const color=queryObject.color;
  const productDimensions=queryObject.productDimensions;
  const material=queryObject.material;
  const type=queryObject.type;
  const pictures=queryObject.pictures;
  const video=queryObject.video;
  const status=queryObject.status;

  console.log(req.body)
    User.findOne( {"bearertoken":bearertoken },{},{ },async (err, users)=>  {
    if(err) return res.json(JSON.parse('{"mesaj":"hata"}'))  
    if(users===null) { 
      return res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

    Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {

      if(product !==null) {
        return res.json(JSON.parse('{"mesaj":"Ekli"}'));
      }
      else
      {
                  var newProduct=new Products({
                    title: title,
                    description: description,
                    brand: brand,
                    weight: weight,
                    itemModelNumber: itemModelNumber,
                    size: size,
                    numberOfİtem: numberOfİtem,
                    quantity: quantity,
                    price: price,
                    batteriesRequired: batteriesRequired,
                    itemWeight: itemWeight,
                    gtin: gtin,
                    ean: ean,
                    added: added,
                    stock: stock,
                    color: color,
                    productDimensions: productDimensions,
                    material: material,
                    type: type,
                    pictures: pictures,
                    video: video,
                    status:true
                  });
                  newProduct.save(function(err,product){
                  if(err)
                  {
                    console.log(err);
                    return res.json(JSON.parse('{"mesaj":'+err+'}'));
                  }else{
                    return res.json(product);
                  }
                }); 
        }
      });
    });
}

module.exports.orderCreate =async function(req,res){
  console.log(req.body)
  ean =req.body.ean
  customerprice =req.body.price
  customerpiece =req.body.piece
  customername =req.body.name
  address =req.body.address
  phone =req.body.phone
 // var ean =req.params.ean
 // var customerprice =req.query.price
 // var customerpiece =req.query.piece
  const bearertoken = req.headers.authorization.split(" ")[1];

   User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, user) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(user===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

    Products.findOne( {"ean":ean },{},{ },async (err, product)=>  {

     if(product ===null) {
       return res.json(JSON.parse('{"mesaj":"Urun bulunamadı"}'));
     }
     
     price=product.price
     stock=product.stock
     console.log(stock);
     console.log(stock);
     console.log(customerpiece);
     if(stock< customerpiece ){
      return res.json(JSON.parse('{"mesaj":"'+stock+' adet urun mevcut"}'));
     }

     const newstock=stock-customerpiece

     


     await User.findOneAndUpdate({"bearertoken":bearertoken}, { $push:{ order :{order:true,name:customername,address:address,phone:phone,ean:ean,customerprice:customerprice,price:price,customerpiece:customerpiece}}  },{upsert:true});
     await Products.findOneAndUpdate({"ean":ean}, { $set:{ "stock" :newstock}  });  
       

     return res.json(JSON.parse('{"mesaj":"ok"}'));
     } );
   } );
 }


 module.exports.orderGetId =async function(req,res){
  const orderid =req.params.orderid
  console.log("orderid"+orderid)
  const customerbearer = req.headers.authorization.split(" ")[1];

   User.findOne( { "bearertoken":customerbearer ,"order._id":orderid },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
     users.order.forEach(async element => {
        if(element._id == orderid)
        {
          console.log(element)
          return  await res.json(element);
        }
    }); 
   } );
 }


 module.exports.orderCancel =async function(req,res){
  const orderid =req.params.orderid
  const customerbearer = req.headers.authorization.split(" ")[1];

    User.findOneAndUpdate({"bearertoken":customerbearer ,"order._id":orderid   }, 
    { $set:{"order.$.order":false}  },{ },async function(err, users) {
      if(err)
      return await res.json(JSON.parse('{"mesaj":"hata"}'));
      else
      return await res.json(JSON.parse('{"mesaj":"ok"}'));
    });   
 }

 module.exports.orderEdit =async function(req,res){
  console.log("req.body")
  console.log(req.body)
  
  customerbearer =req.body.customerbearer
  order =req.body.order
  customername =req.body.name
  address =req.body.address
  phone =req.body.phone
  ean =req.body.ean
  customerprice =req.body.customerprice
  customerpiece =req.body.customerpiece
  price =req.body.price
  id =req.body.id
 // var ean =req.params.ean
 // var customerprice =req.query.price
 // var customerpiece =req.query.piece
 
    await User.findOneAndUpdate({"bearertoken":customerbearer,"order._id":id}, { $set:{ "order.$.order":order,"order.$.name":customername,"order.$.address":address,"order.$.phone":phone,"order.$.ean":ean,"order.$.customerprice":customerprice,"order.$.customerpiece":customerpiece}}  ,{upsert:true});
       

     return res.json(JSON.parse('{"mesaj":"ok"}'));
    
   
 }


 module.exports.orderGetAll =async function(req,res){
  const bearertoken = req.headers.authorization.split(" ")[1];

   User.findOne( { "bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
          return  await res.json(users.order);
   } );
 }





module.exports.userGetAll =async function(req,res){
 // console.log(req.userData)
 const role=req.userData.mrole
   console.log("role"+role)
   if(role !== "admin")
   {
    console.log("role"+role)

    return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))

   }

  const bearertoken = req.headers.authorization.split(" ")[1];

  User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
    return  await res.json(users);
  
  })
}


module.exports.userSetting =async function(req,res){


  const bearertoken = req.headers.authorization.split(" ")[1];
   User.findOne( {"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

     return res.json(users);
     
   } );
 }


module.exports.userGetId =async function(req,res){

  var id =req.params.id

  const bearertoken = req.headers.authorization.split(" ")[1];
   User.findOne( {"_id":id,"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

     return res.json(users);
     
   } );
 }

module.exports.userProducts=async function(req,res){

  var id =req.params.id

  const bearertoken = req.headers.authorization.split(" ")[1];
   User.findOne( {"_id":id,"bearertoken":bearertoken },{},{ },async function(err, users) {
    if(err) return await res.json('{"mesaj":"hata"}');  

    if(users===null) { 
      return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }

     return res.json(users.product);
     
   } );
 }

module.exports.userGetAllSite =async function(req,res){
  // console.log(req.userData)
  const role=req.userData.mrole
    console.log("role"+role)
    if(role !== "admin")
    {
     console.log("role"+role)
 
     return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))
 
    }

    const queryObject = url.parse(req.url,true).query;
    const  start=Number(queryObject.start);
    const length=Number(queryObject.length);
    var draw=queryObject["draw"];
    var searchValue=queryObject["search[value]"];

    if(searchValue==undefined) searchValue="";
    let countData="0";

   User.find( {},{},{ },async function(err, users) {
     if(err) return await res.json('{"mesaj":"hata"}');  
 
     if(users===null) { 
       return await res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
     }

     var userMapBirlestir = [];
     var userMapTek = {};
     sirasi=start;
     
     let    settings="" ;
     let    ordersDiv="" ;
     let    productsDiv="" ;
     users.forEach(function(user) {
      const ordersArray=user.order;
      const productsArray=user.product;
      settings="" ;
      ordersDiv="" ;
      productsDiv="" ;
      ordersArray.forEach(element => {
        color="secondary";
        if(element.order == true) color="primary";
          buttonorder=' <button class="btn btn-'+color+' dropdown-item orderModal" data-bearer="'+user.bearertoken+'" data-id="'+element._id+'"  data-bs-toggle="modal" data-bs-target="#exampleModal">'+element.name+'</button>';
          ordersDiv=ordersDiv+buttonorder;
      });


      productsDiv="" ;
      productsArray.forEach(element => {
        console.log(element)
        color="secondary";
        if(element.product == true) color="primary";
          buttonproduct=' <button class="btn btn-'+color+' dropdown-item productModal" data-bearer="'+user.bearertoken+'" data-id="'+element._id+'"  data-bs-toggle="modal" data-bs-target="#exampleModal">'+element.name+'</button>';
          productsDiv=productsDiv+buttonproduct;
      });



      buttondetail=' <button class="btn btn-primary orderModalDetail" data-bearer="'+user.bearertoken+'" data-id="'+user._id+'"  data-bs-toggle="modal" data-bs-target="#exampleModalDetail">Detail</button>';

      settings=`<div class="btn-group dropend">

      ${buttondetail}

      <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        Orders
      </button>


      <ul class="dropdown-menu">
     
     ${ordersDiv}
      </ul>

      
      <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        Products
      </button>

      
      <ul class="dropdown-menu">
     
     ${productsDiv}
      </ul>

    </div>` ;

       sirasi++;
       userMapTek = {};
       userMapTek["sira"] = sirasi;
       userMapTek["name"] = user.name +" "+user.surname;
       userMapTek["phone"] = user.telefon;
       userMapTek["email"] = user.email;
       userMapTek["site"] = user.site;
       userMapTek["settings"] = settings;
       userMapTek["order"] = user.order;
       
       //userMapTek["setting"] = '<button class="btn btn-primary" data-id="'+user._id+'" id="Düzenle" data-bs-toggle="modal" data-bs-target="#exampleModal">Düzenle</button>'+'<button class="btn btn-primary" data-id="'+user._id+'" data-bearer="'+user.bearertoken+'" id="orders" data-bs-toggle="modal" data-bs-target="#exampleModal">orders</button>';
       userMapBirlestir.push(userMapTek);
       
     });

   const  userMap = {
    "draw":draw,
   "recordsTotal": countData,
   "recordsFiltered": countData,"data":userMapBirlestir};
  
     return  await res.json(userMap);
   
   })
 }
 
 module.exports.usersAdd =async function(req,res){
 
 
  const role=req.userData.mrole
  if(role !== "admin")
  return await res.json(JSON.parse('{"mesaj":"Yetkisiz erisim" }'))

  name =req.body.name
  surname =req.body.surname 
  email =req.body.email
  password =req.body.password
  telefon =req.body.telefon
  userrole =req.body.role
  site =req.body.site
  User.findOne( {"email":email,"telefon":telefon,"site":site },{},{ },async (err, users)=>  {

    if(users !==null) {
      return res.json(JSON.parse('{"mesaj":"Ekli"}'));
    }
    else
    {
      
                var newUsers=new User({
                name :name,
                surname :surname,
                email :email,
                password :password,
                telefon :telefon,
                role :userrole,
                site :site
                });
                newUsers.save(function(err,user){
                if(err)
                {
                  console.log(err);
                  return res.json(JSON.parse('{"mesaj":'+err+'}'));
                }else{
                  tokens=generateToken(64);

                  const bearertoken = jwt.sign({
                    muuid: user._id,
                    mrole: user.role,
                    memail: user.email,
                    mtelefon: user.telefon
                    }, 
                    secret_key,
                    {
                        expiresIn :"365d"
                    }
                    )
                  User.updateOne({_id:user._id},{bearertoken:bearertoken,token:tokens},function(err,userss){if(userss){console.log("guncellendi");console.log(userss)}});
                
                  return res.json(user);
                }
              }); 
      }
    });
 }


 module.exports.userEdit=async function(req,res){ 

  const bearertoken = req.headers.authorization.split(" ")[1];

  name =req.body.nameDetail
  surname =req.body.surnameDetail 
  email =req.body.emailDetail
  password =req.body.passwordDetail
  telefon =req.body.telefonDetail
  userrole =req.body.roleDetail
  site =req.body.siteDetail
  id =req.body.idDetail



    User.findOne( {"_id":id,"bearertoken":bearertoken },{},{ },async (err, user)=>  {

      if(user ===null) {
        return res.json(JSON.parse('{"mesaj":"Bulunamadi"}'));
      }
      else

      User.findOneAndUpdate( {
        "_id": id,"bearertoken":bearertoken
          }, {
              "$set": {
                name: name,
                surname: surname,
                email: email,
                password: password,
                telefon: telefon,
                role: userrole,
                site: site
              }
          },function(err, product) {
            if(err)
            {
              console.log(err);
              return res.json(JSON.parse('{"mesaj":'+err+'}'));
            }else{
              return res.json(product);
            }
          })
    })


}



module.exports.userUserEdit=async function(req,res){ 
  const bearertoken = req.headers.authorization.split(" ")[1];

  name =req.body.name
  surname =req.body.surname
  email =req.body.email
  password =req.body.password
  telefon =req.body.telefon
  site =req.body.site
  ck =req.body.ck
  cs =req.body.cs

    User.findOne( {"bearertoken":bearertoken },{},{ },async (err, user)=>  {

      if(user ===null) {
        return res.json(JSON.parse('{"mesaj":"Bulunamadi"}'));
      }
      else

      User.findOneAndUpdate( {
       "bearertoken":bearertoken
          }, {
              "$set": {
                name: name,
                surname: surname,
                email: email,
                password: password,
                telefon: telefon,
                site: site,
                ck:ck,
                cs:cs
                
              }
          },function(err, product) {
            if(err)
            {
              console.log(err);
              return res.json(JSON.parse('{"mesaj":'+err+'}'));
            }else{
              return res.json(product);
            }
          })
    })


}


  

module.exports.login=function(req,res){
  console.log(req.body)
        User.findOne({telefon:req.body.telefon,password:req.body.password}, function (err1, user) {
          if (user) {
  
            tokens=generateToken(64);
            if ( req.body.remember ) {
              var maxAge_ = 30 * 24 * 3600000;
              res.cookie('token',tokens, { maxAge: maxAge_, httpOnly: true });
            
            } else {
              req.session.cookie.expires = false;
            }  
            const bearertoken = jwt.sign({
              muuid: user._id,
              mrole: user.role,
              memail: user.email,
              mtelefon: user.telefon
              }, 
              secret_key,
              {
                  expiresIn :"365d"
              }
              )
            User.updateOne({_id:user._id},{bearertoken:bearertoken,token:tokens},function(err,userss){if(userss){console.log("guncellendi");console.log(userss);
            User.findOne({telefon:req.body.telefon,password:req.body.password}, function (err1, user) {
              if (user) {
            res.json(user)
              }
              })
          
          
          }})
              
          }
          else
          {
            res.json('{"hata":"hatalı bilgi"}')
          }
          
        });
    
  } 
  

module.exports.signup=function(req,res){
    client.get('code',async function(err,result){
      if(result===null)
        {
          await User.find( {
            $or: [{"email":req.body.email},{"telefon":req.body.telefon}]
          },{},{},async function(err, users) {
            console.log(users)
            if(users.length >0) {
              return res.json('{"mesaj":"Email veya Telefon Kullanımda"}');
            }
            else
            {

              const nodemailer = require('nodemailer');
              const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'asiwahilda@gmail.com',
                  pass: 'azloxayaswjfdwaw',
                },
              });
    
              code= Math.floor(Math.random() * (999998 - 100001)) + 100001;
              console.log(code)
    
             await client.setex("code",120,code,(err, reply) => {});
             await  client.setex("name",120,req.body.name,(err, reply) => {});
             await  client.setex("surname",120,req.body.surname,(err, reply) => {});
             await client.setex("email",120,req.body.email,(err, reply) => {});
             await client.setex("telefon",120,req.body.telefon,(err, reply) => {});
             await client.setex("tc",120,req.body.tc,(err, reply) => {});
             await client.setex("password",120,req.body.password,(err, reply) => {});
             console.log("code: "+code);
              /*
             await  transporter.sendMail({
                from: '"Falanca Şirket" <sirketinfo@memet.com>',
                to: req.body.email, 
                subject: "Mesaj basligi",
                html: "<b>doğrulama kodunuz: "+code+"</b>", 
              }).then(info => {
                console.log("code: "+code);
                res.json(JSON.parse('{"mesaj":"Kod Gönderildi"}'));
              }).catch(() => {
                res.json(JSON.parse('{"mesaj":"Kod Atılamadı"}'));
                console.error});
                */
                res.json(JSON.parse('{"mesaj":"Kod Atıldı: '+code+'"}'));
            }
          }) 
       
          
        }
        else
        {
           res.json(JSON.parse('{"mesaj":"Bekleyen Kayıt var"}'));
        }
    })

}

module.exports.verifity=function(req,res){
  client.mget(['code',"name","surname","email","telefon","tc","password"],function(err,result){
  if(req.body.verifity==result[0])
  {

    tokens=generateToken(64);
            var newUser=new User({
              name: result[1],
              surname: result[2],
              email:result[3],
              telefon:result[4],
              tc:result[5],
              password: result[6],
              token: tokens,
              password_link:"",
              role:"user",
              status:true,
            });
   newUser.save(function(err,user){
      if(err)
      {
        console.log(err);
        res.json('{"mesaj":"'+err+'"}');
      }
      else
      {
        const bearertoken = jwt.sign({
          mrole: user.role,
          muuid: user._id,
          memail: user.email,
          mtelefon: user.telefon
          }, 
          secret_key,
          {
              expiresIn :"365d"
          }
          )
        console.log(user)

        User.updateOne({_id:user._id},{bearertoken:bearertoken},function(err,userss){if(userss){console.log("guncellendi");console.log(userss)}})


        /*
        client.flushall((err, success) => {
          if (err) {
            throw new Error(err);
          }
          console.log(success); 
        });
        */
        res.json(JSON.parse('{"mesaj":"basarili","token":"'+tokens+'","bearertoken":"'+bearertoken+'"}'));
      }
   });
 
  }
  else
  {
    
    if(result[0] ===null) res.json(JSON.parse('{"mesaj":"Zaman Aşımı"}'));
    else
    res.json(JSON.parse('{"mesaj":"Beklenmeyen Hata"}'));
  }
  
  })
  
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


 


module.exports.sorusortek=async function(req,res){ 
  
  const bearertoken = req.headers.authorization.split(" ")[1];
 
  const queryObject = req.body;
  const sorukodu=queryObject.sorukodu;
  const soru=queryObject.soru;
  console.log("veriler alindi")

    User.findOne( {"bearertoken":bearertoken },{},{ },async (err, users)=>  {
    if(err) return res.json(JSON.parse('{"mesaj":"hata"}'))  
    if(users===null) { 
      return res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
    console.log("girildi")

const prompt = soru;
/*
const prompt =  ` const userSchema = new mongoose.Schema({
          name: { type: String},
          orders: [
            {
              phone: {type: String},
            }], 

           }) 
Nodejs ile yukardaki schema göre orders.phone göre sort sıralaması yaptırıp console.log yazmak`;
*/

      const gptResponse = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 4000,
          temperature: 0.9,
          top_p:0.9,
          presence_penalty: 0.9,
          frequency_penalty: 0.9,
		    //  stop: [" Human:", " AI:"],

        });
        console.log("basla")
        console.log(gptResponse.data.choices[0].text)
        console.log("bitis")


    cevap=gptResponse.data.choices[0].text;
    let data = {
      "cevap": cevap
    };
    
    var varmi =users.sorutek.findIndex(x => x.sorukodu ===sorukodu);

    if(varmi>-1) 
    {          
           // await  User.findOneAndUpdate({"bearertoken":bearertoken,"sorukodu":sorukodu}, 
          //      { $set:{ sorutek :{soru:soru,cevap:cevap}}  },{upsert:true});
           
    }
    else
    {
      await  User.findOneAndUpdate({"bearertoken":bearertoken}, 
                { $push:{ sorutek :{sorukodu:sorukodu,soru:soru,cevap:cevap}}  },{upsert:true});
    }
     
           res.json(data);
      });

         
   
}




module.exports.sorusor=async function(req,res){ 
  
  const bearertoken = req.headers.authorization.split(" ")[1];
 
  const queryObject = req.body;
  const sorukodu=queryObject.sorukodu;
  const soru=queryObject.soru;
  console.log("veriler alindi")

    User.findOne( {"bearertoken":bearertoken },{},{ },async (err, users)=>  {
    if(err) return res.json(JSON.parse('{"mesaj":"hata"}'))  
    if(users===null) { 
      return res.json(JSON.parse('{"mesaj":"Token Hatalı"}'));
    }
    console.log("girildi")


const prompt = soru;
//const prompt =  `Human: Bana 14K GOLD rengi ROSE boyutu 5 karatı 0.55 ağılığı 3.04,2.92 ile ilgili bir ürünün hakkında müşteri yorumu yazarmısın ürün detaylarını vermeden\n`;


      const gptResponse = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1600,
          temperature: 0.9,
          top_p: 1,
          presence_penalty: 0,
          frequency_penalty: 0.5,
		  stop: [" Human:", " AI:"],

        });
        console.log(gptResponse.data.choices[0].text)
 

    yeniSoru=soru + " AI:"+gptResponse.data.choices[0].text;

       var varmi =users.soru.findIndex(x => x.sorukodu ===sorukodu);

       if(varmi>-1) 
       {
        console.log("varsa duzenlenecek")

           await   User.findOneAndUpdate({"bearertoken":bearertoken ,'soru.sorukodu':  sorukodu   }, 
              { $set:{ soru :{soru:yeniSoru,sorukodu:sorukodu}}  },{upsert:true}); 
      }
       else{
        console.log("yeni ekleniyor")
            await  User.findOneAndUpdate({"bearertoken":bearertoken}, 
                { $push:{ soru :{sorukodu:sorukodu,soru:yeniSoru}}  },{upsert:true});
           }  

     
           res.json(users);
      });

         
   
}


function generateToken(n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = '';
  for(var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}