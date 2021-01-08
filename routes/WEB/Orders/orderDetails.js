module.exports = function (router, db, async, fs) {
  
   const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  };

  router.post("/myOrders", (req, res) => {
    try {
      var validationStatus = true;
      var Errors = [];
      var responseJson = {};

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
         var offset = (req.body.pageno - 1) * req.body.limit;
         var Nextoffset = req.body.pageno * req.body.limit;
         var reqparms=req.body;

        
        var query ="";
        query +=
           "SELECT trn_order.user_id As userId,trn_order.id As OrderId,`trn_order`.`total_amount`AS Amount  FROM `trn_cart` Inner join trn_cart_details on trn_cart_details.cart_id=trn_cart.id Inner join trn_order on trn_order.user_id=trn_cart.user_id and trn_order.cart_id=trn_cart.id Inner join mas_product on mas_product.id=trn_cart_details.product_id where trn_order.user_id= '"+reqparms.user_id+"' group by OrderId LIMIT " + offset + "," + reqparms.limit + ";";

       

       console.log(query);
         db.query(query,async (err,response)=>{
            if (err) {
              console.log(err.message); 
          res.send({ status: 0, msg: "Failed", data: [] }); 
           } else {
              if (response.length > 0) {
                var nextCount = await nextCountOfMyOrders(
                  req.body.user_id,
                  req.body.limit,
                  Nextoffset
                );

                    res.send({
                      status: 1,
                      msg: "Success",
                      data: [{ details: response, nextCount: nextCount }],
                    });
                
                
          } else {
                res.send({
                  status: 0,
                  msg: "No Data available please try again",
                  data: [],
                });
              }
            }
          }
        );
      }
    } catch {
      res.send({ status: 0, msg: "Internal Server Error", data: [] });
    }
  });


 

  nextCountOfMyOrders = (userId, limit, offset) => {
    return new Promise((resolve, reject) => {
      var query =
        "select count(*) as NextRowCount from (SELECT `id` AS orderId FROM `trn_order` WHERE user_id ='"+userId+"'  LIMIT " + offset + "," + limit + ") as tbl";

      db.query(query, (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(response[0].NextRowCount);
        }
      });
    });
  };


  router.post("/particularOrderDetails", (req, res) => {
    try {
      var validationStatus = true;
      var Errors = [];
      var responseJson = {};

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
        var offset=(req.body.pageno-1)*req.body.limit; 
        var Nextoffset=(req.body.pageno)*req.body.limit ; 
       var reqparms=req.body;
      
        var query ="";
        query +=
           "SELECT trn_order.user_id As userId,trn_order.id As OrderId,trn_cart_details.id As carddetailId, trn_order.cart_id As CartId, mas_product.id As product_id,mas_product.product, trn_cart_details.`unit_rate` AS productRate, `quantity` AS productQty, trn_cart_details.`amount` AS productAmount, payment_status,cancel_status,cancel_date,`trn_order`.`total_amount`AS productAmount,product_image_path As ProductImage FROM `trn_cart` Inner join trn_cart_details on trn_cart_details.cart_id=trn_cart.id Inner join trn_order on trn_order.user_id=trn_cart.user_id and trn_order.cart_id=trn_cart.id Inner join mas_product on mas_product.id=trn_cart_details.product_id where trn_order.id= '"+reqparms.OrderId+"'  group by carddetailId  LIMIT " + offset + "," +reqparms.limit + ";";

         
        console.log(query);
        db.query(query, async (err, response) => {
            if (err) {
              console.log(err.message); 
          res.send({ status: 0, msg: "Failed", data: [] }); 
            } else {
              if (response.length > 0) {
                    res.send({
                      status: 1,
                      msg: "Success",
                      data: response,
                   
                });
              } else {
                res.send({
                  status: 0,
                  msg: "No Data available please try again",
                  data: [],
                });
              }
            }
          }
        );
      }
    } catch {
      res.send({ status: 0, msg: "Internal Server Error", data: [] });
    }
  });

  return router;
};
