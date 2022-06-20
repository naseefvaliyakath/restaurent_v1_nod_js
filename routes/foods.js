var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser')
var cors = require("cors");
var createError = require('http-errors');
var router = express.Router();
const formidable = require('formidable');
var fs = require("fs");
var path = require("path");

var con = mysql.createConnection({
    host: "localhost",
    user: "naseef",
    password: "13641364@@Na",
    database: "restaurent_v1",
  });

router.get('/',(req,res) =>{
    res.send('router food')
})




  ///get today food
  router.get("/getTodayFood", (req, res) => {

  try{
   
    con.query(`SELECT * FROM foods WHERE fdIsToday = 'yes'`, (err, results, fields) => {
      if (err) {
        //error log
        console.log('error is '+err)
        res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
        
      } else {
        
        res.json({"error": false,"errorCode":'no',"totalSize": results.length, data: results })
      }
    });
  }catch(e){
    res.json({"error": true,"errorCode":e,"totalSize": 0,"data":null})
  }

});
  
  ///get all food
  router.get("/getAllFood", (req, res) => {

    try{
     
      con.query(`SELECT * FROM foods`, (err, results, fields) => {
        if (err) {
          //error log
          console.log('error is '+err)
          res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
          
        } else {
          
          res.json({"error": false,"errorCode":'no',"totalSize": results.length, data: results })
        }
      });
    }catch(e){
      res.json({"error": true,"errorCode":e,"totalSize": 0,"data":null})
    }
  
  });


  ///update today food
    router.put("/updateTodayFood",(req, res) => {

      try {
        id = req.body.id
        requst = req.body
        console.log(id);
        console.log(requst);
        con.query(
            "UPDATE foods SET fdIsToday = ? WHERE id = ?",
            [requst.fdIsToday, id],
            (err, results) => {
              if (err) {
                console.log("error: ", err);
                res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
                return;
              }
              if (results.affectedRows == 0) {
                // not found Tutorial with the id
                res.json({"error": true,"errorCode":"Item Not fount","totalSize": 0,"data":null})
                return;
              }
              console.log("created tutorial: ", { id: id, ...requst });
              res.json({"error": false,"errorCode":"Updated successfully","totalSize": 0,"data":null})
    
            }
          );
        
      } catch (error) {
        console.log('catch')
        res.json({"error": true,"errorCode":error,"totalSize": 0,"data":null})
      }


    
  });


  ///update food
  router.put('/updateFood', (req, res) => {


    try {

      const form = new formidable.IncomingForm();
      const uploadFolder = 'uploads'
      form.multiples = false;
      form.maxFileSize = 50 * 1024 * 1024; // 5MB
      form.uploadDir = uploadFolder;
      //console.log(form);
      // Parsing
    form.parse(req, async (err, fields, files) => {
    
      console.log(fields)
      console.log(files)
      
      if (err) {
        console.log("Error parsing the files");
        return res.json({"error": true,"errorCode":err,"totalSize": 0, data: null })
       
      }
     
     
      //check file is exist or not
      var imgLength = Object.keys(files).length
      const fileCheck = files.myFile;
      if (imgLength == 0 || !fileCheck) {
        console.log(uploadFolder)
        
        /// no file
        try {
          id = fields.id
            con.query(
              "UPDATE foods SET fdName = ? ,fdCategory = ? ,fdFullPrice = ?,fdThreeBiTwoPrsPrice = ?,fdHalfPrice = ?,fdQtrPrice = ?,fdIsLoos = ?,cookTime = ?,fdShopId = ?,fdIsToday = ?  WHERE id = ?",
              [fields.fdName,fields.fdCategory,fields.fdFullPrice,fields.fdThreeBiTwoPrsPrice,fields.fdHalfPrice,fields.fdQtrPrice,fields.fdIsLoos,fields.cookTime,58,fields.fdIsToday,fields.id],
              (err, results) => {
                if (err) {
                  console.log("error: ", err);
                  res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
                  return;
                }
                if (results.affectedRows == 0) {
                  // not found Tutorial with the id
                  res.json({"error": true,"errorCode":"Item Not fount","totalSize": 0,"data":null})
                  return;
                }
                //console.log("created tutorial: ", { id: id, ...requst })
                res.json({"error": false,"errorCode":"Updated successfully","totalSize": 0,"data":null})
      
              }
            );
            
          } catch (e) {
           res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
          }
    
         
      } 
      else if(imgLength>1){

        return res.json({"error": true,"errorCode":'multiple file cant upload',"totalSize": 0, data: null })
        
      }
      else {
          const isFileValid = (file) => {
          const type = file.originalFilename.split('.').pop();
          const validTypes = ["jpg", "jpeg", "png"];
          if (validTypes.indexOf(type) === -1) {
            return false;
          }
          return true;
        };
      
      // Check if multiple files or a single file
      if (!files.myFile.length) {
        //Single file
      
        const file = files.myFile;
    
        
        // checks if the file is valid
        const isValid = isFileValid(file);
      
        // creates a valid name by removing spaces
        const fileName = encodeURIComponent(file.newFilename+'.'+file.originalFilename.split(".").pop());
        const updateImg = "https://mobizate.com/uploads/"+fileName;
       

      
        if (!isValid) {
          // throes error if file isn't valid
          return  res.json({"error": true,"errorCode":'The file type is not a valid type',"totalSize": 0, data: null })
          
          
        }
        try {
          // renames the file in the directory
          fs.renameSync(file.filepath, path.join(uploadFolder, fileName))
    
          try {
            id = fields.id
              con.query(
                "UPDATE foods SET fdName = ? ,fdCategory = ? ,fdFullPrice = ?,fdThreeBiTwoPrsPrice = ?,fdHalfPrice = ?,fdQtrPrice = ?,fdIsLoos = ?,cookTime = ?,fdShopId = ?,fdImg = ?,fdIsToday = ?  WHERE id = ?",
                [fields.fdName,fields.fdCategory,fields.fdFullPrice,fields.fdThreeBiTwoPrsPrice,fields.fdHalfPrice,fields.fdQtrPrice,fields.fdIsLoos,fields.cookTime,fields.fdShopId,updateImg,fields.fdIsToday,fields.id],
                (err, results) => {
                  if (err) {
                    console.log("error: ", err);
                    res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
                    return;
                  }
                  if (results.affectedRows == 0) {
                    // not found Tutorial with the id
                    res.json({"error": true,"errorCode":"Item Not fount","totalSize": 0,"data":null})
                    return;
                  }

                  console.log("created tutorial: ", { results })

                  var n = fields.fdImg.lastIndexOf('/');
                  var img_name_get = fields.fdImg.substring(n + 1);
                 

                  fs.stat('./uploads/'+img_name_get, function (err, stats) {
                    console.log(stats);//here we got all information of file in stats variable
                 
                    if (err) {
                        return console.error(err);
                    }

                    console.log(img_name_get)
                    if(img_name_get == 'sample.jpg'){
                      
                    }
                    else{
                      fs.unlink('./uploads/'+img_name_get,function(err){
                        if(err) return console.log(err);
                        console.log('file deleted successfully');
                   });  
                    }
                 

                 });
                  res.json({"error": false,"errorCode":"Updated successfully","totalSize": 0,"data":null})
        
                }
              );
              
            } catch (e) {
             res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
            }
    
            
        } catch (error) {
          console.log(error);
          return  res.json({"error": true,"errorCode":error,"totalSize": 0, data: null })
         
        }
    
      } else {
        // Multiple files
        return  res.json({"error": true,"errorCode":'multiple file cant upload',"totalSize": 0, data: null })
       
      }
      }
    
    
    
    });
    
      
    } catch (error) {
      return res.json({"error": true,"errorCode":error,"totalSize": 0, data: null })
      
    }



  
  });


  //check
  router.get("/check", (req, res) => {

    try{

      fs.stat('./uploads/aa.jpg', function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink('./uploads/aa.jpg',function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     });

      res.json({"error": false,"errorCode":'no',"totalSize": results.length, data: results })

    }catch(e){
      res.json({"error": true,"errorCode":e,"totalSize": 0,"data":null})
    }
  
  });


///get  food by
router.get("/getFoodBy", (req, res) => {
console.log(__dirname)
  try{
    fdCategory = req.body.fdCategory;
    console.log(fdCategory)
    con.query(`SELECT * FROM foods WHERE fdCategory = '${fdCategory}' `, (err, results, fields) => {
      if (err) {
        //error log
        
        console.log('error is '+err)
        res.json({"error": true,"errorCode":err['code'],"totalSize": 0,"data":null})
        
      } else {
        
        res.json({"error": false,"errorCode":'no',"totalSize": results.length, data: results })
      }
    });
  }catch(e){
    res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
  }

});


///insert food
  router.post('/insertFood', (req, res) => {


    try {

      const form = new formidable.IncomingForm();
      const uploadFolder = 'uploads'
      form.multiples = false;
      form.maxFileSize = 50 * 1024 * 1024; // 5MB
      form.uploadDir = uploadFolder;
      //console.log(form);
      // Parsing
    form.parse(req, async (err, fields, files) => {
    
      console.log(fields)
      console.log(files)
      
      if (err) {
        console.log("Error parsing the files");
        return res.json({"error": true,"errorCode":err,"totalSize": 0, data: null })
       
      }
     
     
      //check file is exist or not
      var imgLength = Object.keys(files).length
      const fileCheck = files.myFile;
      if (imgLength == 0 || !fileCheck) {
        console.log(uploadFolder)
        
        /// no file
        try {
          insert_body = {
             "fdName": fields.fdName,
             "fdCategory": fields.fdCategory,
             "fdFullPrice": fields.fdFullPrice,
             "fdThreeBiTwoPrsPrice": fields.fdThreeBiTwoPrsPrice,
             "fdHalfPrice": fields.fdHalfPrice,
             "fdQtrPrice": fields.fdQtrPrice,
             "fdIsLoos": fields.fdIsLoos,
             "cookTime": fields.cookTime,
             "fdShopId": fields.fdShopId,
             "fdImg": "no_data",
             "fdIsToday": "no"
            }
    
           con.query("INSERT INTO foods SET ?", insert_body, (err, results, fields) => { 
             if (err) {        
               console.log(err)   
               //res.send('Sql NOT updated & File NOT uploaded ');
               res.json({"error": true,"errorCode":err['code'],"totalSize": 0, data: null })
               
             } else {

              res.json({"error": false,"errorCode":'no image uploaded',"totalSize": 0, data:null })
              
             }
           });
            
          } catch (e) {
           res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
          }
    
         
      } 
      else if(imgLength>1){

        return res.json({"error": true,"errorCode":'multiple file cant upload',"totalSize": 0, data: null })
        
      }
      else {
          const isFileValid = (file) => {
          const type = file.originalFilename.split('.').pop();
          const validTypes = ["jpg", "jpeg", "png"];
          if (validTypes.indexOf(type) === -1) {
            return false;
          }
          return true;
        };
      
      // Check if multiple files or a single file
      if (!files.myFile.length) {
        //Single file
      
        const file = files.myFile;
    
        
        // checks if the file is valid
        const isValid = isFileValid(file);
      
        // creates a valid name by removing spaces
        const fileName = encodeURIComponent(file.newFilename+'.'+file.originalFilename.split(".").pop());
      
        if (!isValid) {
          // throes error if file isn't valid
          return  res.json({"error": true,"errorCode":'The file type is not a valid type',"totalSize": 0, data: null })
          
          
        }
        try {
          // renames the file in the directory
          fs.renameSync(file.filepath, path.join(uploadFolder, fileName))
    
          try {
            insert_body = {
              "fdName": fields.fdName,
              "fdCategory": fields.fdCategory,
              "fdFullPrice": fields.fdFullPrice,
              "fdThreeBiTwoPrsPrice": fields.fdThreeBiTwoPrsPrice,
              "fdHalfPrice": fields.fdHalfPrice,
              "fdQtrPrice": fields.fdQtrPrice,
              "fdIsLoos": fields.fdIsLoos,
              "cookTime": fields.cookTime,
              "fdShopId": fields.fdShopId,
              "fdImg": "https://mobizate.com/uploads/"+fileName,
              "fdIsToday": "no"
              
             }
             con.query("INSERT INTO foods SET ?", insert_body, (err, results, fields) => { 
               if (err) {        
                 console.log(err)   
                 //res.send('Sql NOT updated & File NOT uploaded ')
                 res.json({"error": true,"errorCode":err['code'],"totalSize": 0, data: null })
               } else {
                res.json({"error": false,"errorCode":'data added success',"totalSize": 0, data: null })               
               }
             });
              
            } catch (e) {
             res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
            }
    
            
        } catch (error) {
          console.log(error);
          return  res.json({"error": true,"errorCode":error,"totalSize": 0, data: null })
         
        }
    
      } else {
        // Multiple files
        return  res.json({"error": true,"errorCode":'multiple file cant upload',"totalSize": 0, data: null })
       
      }
      }
    
    
    
    });
    
      
    } catch (error) {
      return res.json({"error": true,"errorCode":error,"totalSize": 0, data: null })
      
    }



  
  });




module.exports = router;

