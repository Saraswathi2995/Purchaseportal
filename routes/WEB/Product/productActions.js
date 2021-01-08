module.exports = function (router, db, async, fs) {
  
  router.put("/Productmediaupload", async (req, res) => {
    try {
      var reqParams = req.body;

      var productId = reqParams.productId;

      var uploadimageData =
        req.files == null
          ? []
          : Array.isArray(req.files.imageArray) == true
          ? req.files.imageArray
          : [req.files.imageArray];

      let uploadImageResponse = await uploadImage(uploadimageData, productId);
      if (uploadImageResponse.status == false) {
        res.send({ status: 0, msg: "Media Not Uploaded", data: [] });
      } else {
        res.send({ status: 1, msg: "Media added successfully", data: [] });
      }
    } catch (err) {
      res.send({ status: 0, msg: "Internal Server Error", data: [] });
    }
  });

  function uploadImage(data, productId) {
    
    return new Promise((resolve) => {
      async.forEachOf(
        data,
        function (obj, index, callback) {
          var imageName = "product" + productId + "_" + obj.name;
          
          obj.mv('./uploads/' + imageName, function (err) {
            if (err) {
              console.log("err", err);
            } else {
              console.log(obj);
              var query =
                "UPDATE `mas_product` SET product_image_path = '"+imageName+"' WHERE mas_product.id = '"+productId+"'";
              db.query(query, function (err, response) {
                if (err) {
                  console.log(err);
                }
              });
            }
            callback();
          });
        },
        function (err) {
          if (err) {
            console.log(err.message);
            resolve({ status: false, response: err.message });
          } else {
            resolve({ status: true, response: true });
          }
        }
      );
    });
  }
 
  return router;
};
