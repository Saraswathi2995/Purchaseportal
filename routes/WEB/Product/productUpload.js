module.exports = function (router, db, async, fs,csv,parse,path) {

  router.post("/productdetailsuploadfile", async (req, res) => {

  var uploadproductData = req.files == null ? []: Array.isArray(req.files.uploadFile) == true ? req.files.uploadFile : [req.files.uploadFile];
         var files = uploadproductData;
         console.log(uploadproductData);
      for (var i = 0; i < files.length; i++) {
            
            var type = files[i].mimetype;
              if(type == "text/csv")
            {
               let uploadproductResponse = await uploadFile(uploadproductData);
                console.log("res",uploadproductResponse)
                if (uploadproductResponse.status == false) {
                         res.send({ status: 0, msg: "Media Not Uploaded", data: [] });
                    } else {
                       console.log("dir",'./uploads/' +uploadproductResponse)
                      var importdata= await importCsvData2MySQL('./uploads/' +uploadproductResponse);
                       
                      res.send({ status: 1, msg: "File uploaded/import successfully!", data:[ ] });
                    }
            }
            else
            {
              res.send({ status: 0, msg: "Please upload CSV FIle", data: [] });
            }
         }
    
  });

   function uploadFile(data) {
    
    return new Promise((resolve) => {
      async.forEachOf(
        data,
        function (obj, index, callback) {
          var imageName = new Date().getTime()+ "-" + obj.name;
          
          obj.mv('./uploads/' + imageName, function (err) {
            if (err) {
              console.log("err", err);
            } else {
              resolve(imageName);
              console.log(imageName);
               console.log("Fileupload Success:");
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
 
  
 function importCsvData2MySQL(filePath){
  var csvData=[];
  fs.createReadStream(filePath)
   .pipe(parse())
   .on("data", function (row) {
            csvData.push(row);

            console.log("Sample",row);
        // console.log("Sample is: "+row.index_number);
        // console.log("Samplepro is: "+row.product);
          var query="";
            query +="select * from mas_product where `index_number`= '"+row.index_number+"' and `product`= '"+row.product+"';";
              console.log(query);
               db.query(query,(error, response) => {
            if(error) {
              console.log(error);
            } else {
              if(response.length>0)
              {
               query += "UPDATE  `mas_product` set `product_description`='"+row.product_description+"',`product_image_path`= '"+row.product_image_path+"',`product_quantity`='"+row.product_quantity+"', `product_rate`='"+row.product_rate+"', `active_flag`='"+row.active_flag+"' where `index_number`='"+row.index_number+"' and product='"+row.product+"' ;";
                          console.log(query);
                     db.query(query,(error, response) => {
                      if(error) {
                       console.log(error);
                  } else {
                     console.log("UpdatedSuccessfully",response); 

                  }
                  });

              }
                   else
                    {
                 query += "INSERT INTO `mas_product`(`index_number`, `product`, `product_description`,`product_image_path`, `product_quantity`, `product_rate`, `active_flag`) VALUES ('"+row.index_number+"','"+row.product+"','"+row.product_description+"','"+row.product_image_path+"','"+row.product_quantity+"','"+row.product_rate+"','"+row.active_flag+"');";
                          console.log(query);
                     db.query(query,(error, response) => {
                      if(error) {
                       console.log(error);
                  } else {
                     console.log("InsertedSuccessfully",response); 
                  }
                  });
              }
               }
           
        })
     })
   
   .on("end", function () {
            // Remove Header ROW
            csvData.shift();
            
       fs.unlinkSync(filePath)
    });
 
    
}
 

   return router;
};
