module.exports = function (router, db, async, fs) {

 router.post("/getcartdetailsById", (req, res) => {
       try {
      let validationStatus = true;
      let Errors = [];
      let responseJson = {};

      if (req.body) {
        Object.entries(req.body).map((bodyKey, i) => {
          if (
            typeof bodyKey[1] == null ||
            bodyKey[1] == undefined ||
            bodyKey[1] == ""
          ) {
            Errors.push(`${bodyKey[0]} is empty or incorrect`);
            validationStatus = false;
          } else {
            bodyKey[i];
          }
        });
      } else {
        Errors.push("Request Body is empty");
        validationStatus = false;
      }
      if (!validationStatus) {
        responseJson.status = 0;
        responseJson.msg = "Invalida Request Body";
        responseJson.payload = Errors;
        return res.send(responseJson);
        } else {
              
         
          
          var reqparm =req.body;
             
          var query="";
             query +="select trn_cart.id As CartId,trn_cart_details.id As CartdetailId,mas_product.id As product_id,`index_number`, `product`,`product_rate`,`active_flag`,`quantity`, product_image_path As ProductImage from trn_cart Inner join trn_cart_details on trn_cart_details.cart_id =trn_cart.id Inner join mas_product on mas_product.id=trn_cart_details.product_id where trn_cart.user_id='"+reqparm.userId+"' and cart_status=1 ";
        
      db.query(query, (err, response) => {
        if (err) {
           console.log(err.message); 
          res.send({ status: 0, msg: "Failed", data: [] }); 
       } else {
         if (response.length > 0) {
          
           response.forEach(async (item, i) => {
              
              response[i].selectedQuantity = await selectQuantityhandler(
              response[i].product_id,
              req.body.userId,
              response[i].CartId 
              
            );
              if(i == response.length - 1)
                            
                      res.send({
                              status: 1,
                              msg: "Success",
                               data: response
                            
                            });
                          })
         } else { 
           res.send({
             status: 0,
             msg: "Data is Empty",
             data: response
          });
        }
       }
     });

    } 
  }catch {
         res.send({ status: 0, msg: "Internal Server Error", data: [] });
       }
     });


 var selectQuantityhandler=(product_id,userId,CartId)=>{
    return new Promise((resolve, reject) =>{

      var query =
      "SELECT  SUM(`trn_cart_details`.`quantity`) As Noofitems FROM `trn_cart_details` INNER JOIN trn_cart on trn_cart.id=trn_cart_details.cart_id where trn_cart.user_id= '"+userId+"' and trn_cart_details.product_id='"+product_id+"' and  trn_cart_details.cart_id ='"+CartId+"'";  
        
        
                     
        console.log(query)
        db.query(query,(err,response)=>{
            if(err){
                console.log(err);
                 return reject(err);
            }else{
                if (response.length > 0) {
                  resolve(response);
                  }else{

                      resolve([]);
                  }
            }
        })

    })
}





  

  router.post("/customerConfirmOrder",async (req, res)=> {
 
    var reqparms= req.body;
    console.log(reqparms)
    
    var query ="";
    query +=
    "INSERT INTO `trn_order`(`user_id`, `cart_id`, `total_amount`, `order_date`, `payment_status`,  `created_by`, `created_on`) VALUES ('" + reqparms.user_id +  "','" + reqparms.cart_id + "','" +reqparms.orderAmount + "',NOW(),'" + reqparms.payment_status + "','" + reqparms.user_id +"', NOW());";

       query +="UPDATE `trn_cart` SET cart_status= 0 WHERE trn_cart.id='"+reqparms.cart_id+ "';";
     


      console.log(query);
    db.query(query,async function (err, response) {
      if (err) {
        console.log(err);  
              res.send({ status: 0, msg: 'Failed', data: err }); 
      } else {
        console.log("response", response);
        if (response.affectedRows != 0) {

          res.send({ status: 1, msg: "Order Placed Successfully", data: [] });

        } else {
          res.send({ status: 0, msg: "Order not Placed ", data: [] });
        }
      }
    });
  });

//********************Product Order Functionality END***************************************//

router.post('/cancelproductOrder',(req,res)=>{

  var query = "UPDATE `trn_order` SET `cancel_status` = '1',cancel_date = NOW() WHERE `trn_order`.`id` = '"+req.body.orderId+"';";

  db.query(query,(err, response)=>{
    if (err) {
     console.log(err);  
              res.send({ status: 0, msg: 'Failed', data: err }); 
    } else {
      if(response.affectedRows = 1){

        res.send({ status: 1,msg: "Success", data: [] });
      }else{
        res.send({ status: 0, msg: "Cant't able to delete", data: [] });

      }

    }
  })
})




   return router;
};