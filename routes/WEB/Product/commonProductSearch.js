module.exports = function (router, db,async,fs) {
  


  router.post("/commonProductSearch", (req, res) => {
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
        var reqparam=req.body;
        
         var query =
          "SELECT mas_product.id AS productId, `product` AS productName, `product_description` AS productDesc, `product_rate` AS productRate,product_image_path AS productMedia FROM `mas_product`  WHERE mas_product.active_flag = 1 AND (product LIKE '%" +
          req.body.searchContent +
          "%' OR product_description LIKE '%" +
          req.body.searchContent +
          "%') LIMIT " + offset + "," + reqparam.limit + ";";

         console.log(query);
         db.query(query,async (err,response)=>{
            if (err) {
              console.log(err.message); 
          res.send({ status: 0, msg: "Failed", data: [] }); 
          } else {
            if (response.length > 0) {
              var nextCount = await nextCountOfcommonproductSearch(
                reqparam.limit,
                Nextoffset,
                reqparam.searchContent
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


  nextCountOfcommonproductSearch = (limit, offset, searchContent) => {
    return new Promise((resolve, reject) => {
       var query =
        "select count(*) as NextRowCount from (SELECT mas_product.id AS productId FROM `mas_product`  WHERE mas_product.active_flag = 1 AND (product LIKE '%" +
        searchContent +
        "%' OR product_description LIKE '%" +
        searchContent +
        "%') LIMIT " + offset + "," + limit + ") as tbl";
     
      console.log(query);
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
  return router;
};
