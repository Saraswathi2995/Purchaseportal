module.exports = function (router, db, async, fs) {

   router.post("/getordercountDetailsbydate", async (req, res) => {
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
        let orderCountDetails = await orderCountDetailsHandler(req.body);
        let orderCancelledCountDetails = await orderCancelledCountDetailsHandler(req.body);

        if (
          orderCountDetails.status &&
          orderCancelledCountDetails.status
        ) {
          res.send({
            status: 1,
            msg: "Success",
            data: [
              {
                orderCount: orderCountDetails.count,
                ordercancelledcount: orderCancelledCountDetails.count
              },
            ],
          });
        } else {
          res.send({
            status: 0,
            msg: "No Data available please try again",
            data: [],
          });
        }
      }
    } catch {
      res.send({ status: 0, msg: "Internal Server Error", data: [] });
    }
  });

 function orderCountDetailsHandler(requestData) {
    return new Promise((resolve, reject) => {
      var query = "SELECT COUNT(id) AS totalOrderCount FROM `trn_order` where DATE(order_date)='"+requestData.date+"' and cancel_status=0";

      db.query(query, (err, response) => {
        if (err) {
          console.log(err);
          resolve({ status: false });
        } else {
          resolve({ status: true, count: response[0].totalOrderCount });
        }
      });
    });
  }

   function orderCancelledCountDetailsHandler(requestData) {
    return new Promise((resolve, reject) => {
      var query = "SELECT COUNT(id) AS totalOrdercancelCount FROM `trn_order` where DATE(cancel_date)='"+requestData.date+"' and cancel_status=1";

      db.query(query, (err, response) => {
        if (err) {
          console.log(err);
          resolve({ status: false });
        } else {
          resolve({ status: true, count: response[0].totalOrdercancelCount });
        }
      });
    });
  }

	 //********************Order details count Functionality END***************************************//


router.post("/getproductspurchasedcountDetailsbycustomer", async (req, res) => {
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
      	var  reqparm=req.body;
        var query ="";

          query +="SELECT COUNT(product_id) AS totalproductpurchaseCount,SUM(`trn_cart_details`.`quantity`) As Noofitems  FROM `trn_order` Inner join trn_cart_details on trn_cart_details.cart_id=trn_order.cart_id where trn_order.user_id='"+reqparm.user_id+"' and cancel_status=0";
        console.log(query);
         db.query(query,async (err,response)=>{
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
