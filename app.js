//jshint esversion:6

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req, res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/",function(req,res){
var firstname = req.body.fname;
var lastname = req.body.lname;
var email = req.body.e;
var data = {
  members: [
    {email_address:email,
    status: "subscribed",
    merge_fields:{
      FNAME: firstname,
      LNAME: lastname
    }
    }
  ]
};

var jsondata = JSON.stringify(data);

var options = {
  url: "https://us20.api.mailchimp.com/3.0/lists/<list id>",
  method: "POST",
  headers:{
    "Authorization": "username <apikey>"
  },
  body: jsondata
  };

request(options,function(error, response, body){
  if(error)
  {
    res.sendFile(__dirname + "/failure.html");
  } else {
      if(response.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
        } else {
          res.sendFile(__dirname + "/failure.html");
        }
    }
});
});

app.post("/failure",function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server running at 3000");
});
