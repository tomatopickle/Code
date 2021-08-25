// This code might be a little ineffective, I made this before I knew about Databases.
var express = require('express');
require("nativefier");
const cookieParser = require("cookie-parser");
var fs = require('fs');
var app = express();
var randomString = require('random-string');
//setting middleware

//Serves resources from public folder
app.listen(process.env.PORT||5000);

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.post("/save", function(req, res) {
  var name = randomString();
  var body = "";
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    fs.writeFile(__dirname + `/public/sites/${name}.html`, body, function(err) {
      if (err) return console.log(err);
      res.end(name)
    });
  });
});
app.get("/verify", function(req, res) {
  var body = "";
  var accData = require(__dirname + "/accData.json");
  var q = req.query;
  var accThere = false
  accData.forEach(function(item) {
    if (item.email == q.email) {
      accThere = true;
      res.end("200");
      return
    }
  });
  q.files = [];
  if (!accThere) {
    accData.push(q);
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end("acc made");
    });
  }
});
app.get("/editAcc/name", function(req, res) {
  var body = "";
  var accData = require(__dirname + "/accData.json");
  var q = req.query;
  var accThere = false;
  accData.forEach(function(item) {
    if (item.email == q.email) {
      item.name = q.data;
      res.end("200");
      return
    }
  });
  q.files = [];
  if (!accThere) {
    accData.push(q);
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end("updated");
    });
  }
});
app.get("/editAcc/avtr", function(req, res) {
  var body = "";
  var accData = require(__dirname + "/accData.json");
  var q = req.query;
  var accThere = false;
  accData.forEach(function(item) {
    if (item.email == q.email) {
      item.avatar = q.data;
      res.end("200");
      return
    }
  });
  q.files = [];
  if (!accThere) {
    accData.push(q);
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end("updated");
    });
  }
});
app.get("/addToUserFile", function(req, res) {
  var accData = require(__dirname + "/accData.json");
  var q = req.query;
  var data = {};
  data.file = q.file;
  data.fileName = q.fileName;
  data.starred = "false";
  accData.forEach(function(item, i) {
    if (item.email == q.email) {
      accThere = true;
      accData[i].files.push(data)
      res.end("200");
      return
    }
  });
  fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
    if (err) return console.log(err);
    res.end("200");
  });
});
app.get("/user", function(req, res) {
  var accData = require(__dirname + "/accData.json");
  var q = req.query;
  accData.forEach(function(item, i) {
    if (item.email == q.email) {
      accThere = true;
      res.end(JSON.stringify(accData[i]));
    }
  });
});
app.post("/update", function(req, res) {
  var body = "";
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', chunk => {
    fs.writeFile(__dirname + "/public/sites/" + req.cookies.file + ".html", body, function(err) {
      if (err) {
        console.log(err)
      };
      res.end("200");
    });
  });

  res.end("200")
});
app.get("/delete", function(req, res) {
    var accData = require(__dirname + "/accData.json");
    var q = req.query;
    var accThere = false;
    accData.forEach(function(item, i) {
        if (item.email == q.email) {
            item.files.forEach(function(data,index){
            if(q.file == data.file){
                  fs.unlink(__dirname + "/public/sites/" + data.file + ".html", function(err) {
                    if (err) throw err;
                  });
              item.files.splice(index, 1);
              accThere = true;        
            }
            })
        }
    });
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end("Deleted");
    });
  });
app.get("/updateName", function(req, res) {
    var accData = require(__dirname + "/accData.json");
    var q = req.query;
    var accThere = false;
    accData.forEach(function(item, i) {
        if (item.email == q.email) {
            item.files.forEach(function(data,index){
            if(q.file == data.file){
               data.fileName = q.data;
               console.log(data)
              accThere = true;        
            }
            })
        }
    });
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end("200");
    });
  });
app.get("/star", function(req, res) {
    var accData = require(__dirname + "/accData.json");
    var q = req.query;
    var stat = "400";
    var accThere = false;
    accData.forEach(function(item, i) {
        if (item.email == q.email) {
            item.files.forEach(function(data,index){
            if(q.file == data.file){
              stat = data.starred == "false" ? "true" : "false";
              data.starred = stat;
              accThere = true;        
            }
            })
        }
    });
    fs.writeFile(__dirname + "/accData.json", JSON.stringify(accData), function(err) {
      if (err) return console.log(err);
      res.end(stat);
    });
  });
