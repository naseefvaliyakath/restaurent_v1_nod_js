var express = require("express");
var app = express();
var mysql = require("mysql");
var bodyParser = require('body-parser')
var cors = require("cors");
var createError = require('http-errors');
var path = require("path");
app.use(express.static((__dirname+'public/')))
app.use('/uploads', express.static(('uploads')))

/////routes/////////
var foods = require('./routes/foods');
var category = require('./routes/category');
/////routes/////////

/////parse/////////
app.use(bodyParser.urlencoded({ extended: true  }))
app.use(bodyParser.json())
app.use(cors());
/////parse/////////

////////crerate connection to sql//////
var con = mysql.createConnection({
  host: "localhost",
  user: "naseef",
  password: "13641364@@Na",
  database: "restaurent_v1",
});


con.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }

  console.log("connected as id " + con.threadId);
});
////////crerate connection to sql//////

//*************start code****************//



app.use("/node/food", foods);
app.use("/node/category", category);

app.get("/node/", (req, res) => res.send("Welcom"));


app.listen(3000, () => console.log("server started"));