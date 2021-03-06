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
//======================App Configuration================================


//====================


// import my ArticleProvider module and connect to a server
var ArticleProvider = require('./data_providers/data_provider_mongo').ArticleProvider;
// You have to give your own database url and port here
var mongoUrl = process.env.MONGOHQ_URL || 'mongodb://admin:admin123@localhost:27017/node-mongo-blog'

var articleProvider = new ArticleProvider(mongoUrl);

articleProvider.findAll(function (error,result){
  console.log(result);
});
//======================





//==============Routers===========================
//
app.get('/',function (req,res){
  res.render('index',{title:'welcome'});
});
app.get('/environment',function (req,res){
  
  res.send(process.env['MONGO_NODE_DRIVER_HOST']);
  
});



app.get('/blog', function(req, res){
    articleProvider.findAll( function(error,docs){
        res.render('blog',{
            title: 'Blog',
            articles:docs
            
        });
    })
});


//=======Rooute To Create New Post======================
app.get('/blog/new',function (req,res){
  res.render('newpost',{title:'Create New Post'});
});

app.post('/blog/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/blog')
    });
});
//=======================================================

app.get('/blog/:id',function(req,res){
    articleProvider.findById(req.params.id,function(error,article){
        res.render('blogdetail',{title:article.title,article:article});
      
    });
});

app.post('/blog/addComment', function(req, res) {
    if(!req.param('person')|| !req.param('comment'))
    {
      res.redirect('/blog/'+req.param('_id'));
    }
    else{
        articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
        } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
    }
});
//=============================================
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});