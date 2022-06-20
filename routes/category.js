var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser')
var router = express.Router();


var con = mysql.createConnection({
    host: "localhost",
    user: "naseef",
    password: "13641364@@Na",
    database: "restaurent_v1",
  });

router.get('/',(req,res) =>{
    res.send('router category')
})



///get  category by
router.get("/getCategory", (req, res) => {
  console.log(req.query.fdShopId)
  try{
    fdShopId = req.query.fdShopId;
    //console.log(fdShopId)
    con.query(`SELECT * FROM category WHERE fdShopId = '${fdShopId}' `, (err, results, fields) => {
      if (err) {
        //error log
        
        console.log('error is '+err)
        res.json({"error": true,"errorCode":err.code,"totalSize": 0,"data":null})
        
      } else {
        
        res.json({"error": false,"errorCode":'no',"totalSize": results.length, data: results })
      }
    });
  }catch(e){
    console.log('errordd is '+e)
    res.json({"error": true,"errorCode":e,"totalSize": 0, data: null })
  }

});






module.exports = router;

