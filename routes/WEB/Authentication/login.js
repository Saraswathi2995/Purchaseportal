module.exports = function (router, db,async,jsonwebtoken,checkauth,bcrypt,transporter,fs) {


    router.post("/registration", async (req, res) => {

    var reqParam = req.body;
    var name=reqParam.name;
    var email = reqParam.email;
    var password = reqParam.password;
    var usertypeId = reqParam.usertypeId;

     var existlogindetails =await existlogindetailsCheckingHandler(reqParam);


     console.log(existlogindetails)
     if(existlogindetails.status){
       res.send({ status: 0, msg: existlogindetails.msg, data: [] });
       return
     }
   
  
   
    var query =
    "INSERT INTO `mas_user`(`user_type`, `user_name`, `user_email`, `updated_on`, `active_flag`) VALUES  ('"+reqParam.usertypeId+"','"+reqParam.name+"','"+reqParam.email+"',Now(),1);";
    
     
    db.query(query, async function (err, response) {
      if (err) {
        console.log(err);
        res.send({ status: 0, msg: "Failed", data: err });
      } else {
        if (response.affectedrows != 0) {
          password = await hashPassword(password);
          query =
             "update mas_user set user_password='" +
             password +
             "' where user_email='" +
             email +
             "' and user_type='"+usertypeId+"'";
            
          var output = await updatePassword(query);
          console.log({ output: output });
          console.log({ output: output.err });
                  
          res.send({
            status: 1,
            msg: "Welcome to purchase portal",
            data: [],
          });
        } else {
          res.send({ status: 0, msg: "failed", data: [] });
        }
      }
    });
  
  });

 function existlogindetailsCheckingHandler(requestData){

    return new Promise((resolve, reject) => {

      var query = "SELECT * FROM `mas_user` WHERE user_email = '"+requestData.email+"' AND user_type = '"+requestData.usertypeId+"' and active_flag=1;";
      console.log(query);

      db.query(query,(err, response)=>{
              if(err){
                console.log(err);
            resolve({status: false, msg: "Failed"})

              }else{
                if(response.length > 0){
                  resolve({status: true, msg: "Already Email Id Registered"});

                }
                else
                   resolve({status: false, msg: "Not An User"});
              }
            })

    })

  }

 function updatePassword(query) {
    return new Promise((resolve) => {
      db.query(query, (err, response) => {
        if (err) {
          resolve(err);
          console.log({ err: err });
          return;
        } else {
          console.log({ response: response });
          resolve(response);
          return;
        }
      });
    });
  }

  //*******************************get  HashPassword***********************************************************//
  async function hashPassword(Userpassword) {
    console.log({ userPassword: Userpassword });
    const password = Userpassword;
    const setRounds = 10;
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(password, setRounds, (err, hash_val) => {
        if (err) {
          reject(err);
        } else {
          console.log({ hash: hash_val });
          resolve(hash_val);
        }
      });
    });
    console.log({ hashedPassword: hashedPassword });
    return hashedPassword;
  }

 

  
//******************* Create User functionality END *****************************/

  router.post("/userLogin", (req, res) => {
 
    var reqParam = req.body;
    var email = reqParam.email;
    var password = reqParam.password;
    var usertypeId=reqParam.usertypeId;

    var query =
      "SELECT * FROM `mas_user` WHERE user_email ='" +
      reqParam.email +
      "' and user_type='"+reqParam.usertypeId+"';";
    db.query(query,async function (err, response) {
      if (err) {
        console.log(err);
        res.status(404).send({ status: 0, msg: "Failed", error: err });
      } else {
        if (response.length < 1) {
          return res
            .status(404)
            .json({ status: 1, msg: "Authentication failed" });
        } else {

          bcrypt.compare(password, response[0].user_password, (error, result) => {
            if (err) {
              res
                .status(401)
                .send({
                  status: 0,
                  msg: "Authentication failed",
                  error: error,
                });
            }
            if (result) {
          
              const token = jsonwebtoken.sign(
                {
                  email: email,
                  userId: response[0].id,
                },
                process.env.JWT_KEY,
                { expiresIn: "5h" }
              );

              let userData = {
                userId : response[0].id,
                userName : response[0].user_name,
                userEmail : response[0].user_email
              }

              res
                .status(200)
                .send({
                  status: 1,
                  msg: "Welcome to purchase portal",
                  data: userData,
                  token: token,
                });
            } else {
              res
                .status(401)
                .send({
                  status: 0,
                  msg: "Authentication failed",
                  error: error,
                });
            }
          });
        }
      }
    });
  });

  async function GenerateToken(payload) {
    
    return new Promise((resolve) => {
      const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      console.log({ token: token });

      resolve({ status: 1, msg: "Authentication success", token: token });
    });
  }

 //**********login functionality*******************************************************************

 router.post("/sendcodeResetPassword", (req, res) => {
    var reqParam = req.body;
    var email = reqParam.email;
    var usertypeId = reqParam.usertypeId;

      var query =
      "SELECT * FROM `mas_user` WHERE user_email ='" +
      reqParam.email +
      "' and user_type='"+reqParam.usertypeId+"';";
    db.query(query, async function (err, result) {
      if (err) {
        console.log(err);
        res.status(404).send({ status: 0, msg: "Invalid Mail ID", error: err });
      } else {
        console.log("result", result);
        if (result.length > 0) {
          var subject = "Reset Password";
          GeneratedToken = await GenerateToken({ email: email });
          var token = GeneratedToken.token;
          console.log({ token: token });
          var msg = token;
          var output = mailing(email, msg, subject);
          if ((output.status = 0)) {
            res.status(404).send({ status: 0, msg:"Mail Send Failed! Try again"});
          } else {
            res.send({ status: 1, msg: "Mail Send Successfully" ,data:msg});
          }

        } else {
          res
            .status(404)
            .send({ status: 0, msg: "Invalid Mail ID", data: result });
        }
      }
    });
  });

 function mailing(mailId, message, subject) {
    return new Promise((resolve) => {
      var mailOptions = {
        from: "caprillsweet6@gmail.com",
        to: mailId,
        subject: subject,
        html: message,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        console.log(mailOptions);
        if (error) {
          console.log(error);
          resolve({
            status: 0,
            msg: "Mail Id is not valid",
            data: [],
          });
        } else {
          resolve({
            status: 1,
            msg: " Mail sent to the User",
            data: [],
          });
        }
      });
    });
  }

 router.post("/resetPassword", checkauth, async (req, res) => {
    var reqParam = req.body;
    var email = reqParam.email;
    var password = reqParam.password;
    var usertypeId=reqParam.usertypeId;

    var query =
      "SELECT * FROM `mas_user` WHERE user_email ='" +
      email +
      "' and user_type='"+usertypeId+"';";
    db.query(query, async function (err, response) {
      if (err) {
        console.log(err);
        res.send({ status: 0, msg: "Failed", data: err });
      } else {
        if (response.length > 0) {
          password = await hashPassword(password);
          query =
            "update mas_user set user_password='" +
            password +
            "' where user_email='" +
            email +
            "' and user_type='"+usertypeId+"'";
          var output = await updatePassword(query);
          console.log({ output: output });
          console.log({ output: output.err });
          res.send({
            status: 1,
            msg: "Password updated sucessfully",
            data: [],
          });
        } else {
          res.send({ status: 0, msg: "Invalid Mail ID", data: [] });
        }
      }
    });
  });
  
  

 return router;
};


