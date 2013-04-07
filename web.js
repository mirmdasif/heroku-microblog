var express = require('express');
var app = express(express.logger());

//=================App Configuration===================
app.configure(function (){
  //Set views of the app
  app.set('views',__dirname+'/views');
  // Set view engine
  app.set('view engine','jade');
  app.set('View Options',{layout : false});

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname+'/public'));
});
//======================================================


app.get('/', function(req, res) {
  res.render('index',{title:'welcome'});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});