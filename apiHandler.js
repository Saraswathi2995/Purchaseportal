
//WEB ADMIN 

//Authentication

const webAuthentication = require("./routes/WEB/Authentication/login");
//Products
const commonProductSearch = require("./routes/WEB/Product/commonProductSearch");
const productSearch = require("./routes/WEB/Product/ProductSearch");
 const productActions = require("./routes/WEB/Product/productActions");
const productUpload = require("./routes/WEB/Product/productUpload");
//Orders
 const orderProduct = require("./routes/WEB/Orders/orderProduct");
 const orderAction = require("./routes/WEB/Orders/orderAction");
 const orderDetails = require("./routes/WEB/Orders/orderDetails");
 const orderCount = require("./routes/WEB/Orders/orderCount");





let apiHandler = {  
    init: function(app,router,db,fs,async,dateFormat,bcrypt,jsonwebtoken,checkauth,transporter,request,csv,parse,path)

    {   
        let version = "/api/v1/";  

        

        //WEB ADMIN 
        //Authentication
        app.use(version,webAuthentication(router,db,async,jsonwebtoken,checkauth,bcrypt,transporter,fs));
        //Products
        app.use(version,commonProductSearch(router,db,async,fs));
         app.use(version,productSearch(router,db,async,fs));
         app.use(version,productActions(router,db,async,fs));
         app.use(version,productUpload(router, db, async, fs,csv,parse ));
        //Orders
        app.use(version,orderProduct(router,db,async,fs));
        app.use(version,orderAction(router,db,async,fs));
        app.use(version,orderDetails(router,db,async,fs));
        app.use(version,orderCount(router,db,async,fs));
            
       

      
        
       }      
};
module.exports = apiHandler;  
