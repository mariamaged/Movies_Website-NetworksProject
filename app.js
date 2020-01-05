// Libraries
const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const session = require('express-session');

// Setup
// Views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Public folder
app.use(express.static(path.join(__dirname, 'public')));
// JSON, Express and body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }));
// Sessions
app.use(session({secret:'MYM', saveUnitialized: true, resave: true}));

// ---------------------------------------------------------------------------------------------------------
// Login
app.get('/', function(req, res) {
if(req.session.username) {
  res.redirect('/home');
}
else {
  res.render('login', {alert:''});
}});

app.get('/login', function(req, res) { 
if(req.session.username) {
  res.redirect('/home');
}
else {
  res.render('login', {alert: ''});
}});

app.post('/', function(req, res) { //action attribute is left out. This means that the URI the form will be submitted to is the current document.
    var FileUnparsed = fs.readFileSync('database.json');
    var File = JSON.parse(FileUnparsed);
    var sendmessage;
    var message = 'Wrong username!';
    for(var i = 0 ; i<File.length; i++){
      if(File[i].username === req.body.username) {
          if(File[i].password !== req.body.password) {
            sendmessage=true;
            message = 'Wrong password!';
            break;
          }
          else {
            sendmessage = false;
            break;
          }
        }
         else { 
          sendmessage=true;
        }
      }
    if(sendmessage) {
      res.render('login', {alert: message});
    }

    else {
      req.session.username=req.body.username;
      req.session.password=req.body.password;
      res.redirect('/home');
    }});

app.post('/login', function(req, res) { //action attribute is left out. This means that the URI the form will be submitted to is the current document.
  var FileUnparsed = fs.readFileSync('database.json');
  var File = JSON.parse(FileUnparsed);
  var sendmessage;
  var message = 'Wrong username!';
  for(var i = 0 ; i<File.length; i++){
    if(File[i].username === req.body.username) {
        if(File[i].password !== req.body.password) {
          sendmessage=true;
          message = 'Wrong password!';
          break;
        }
        else {
          sendmessage = false;
          break;
        }
      }
       else { 
        sendmessage=true;
      }
    }
  if(sendmessage) {
    res.render('login', {alert: message});
  }

  else {
    req.session.username=req.body.username;
    req.session.password=req.body.password;
    res.redirect('/home');
  }});

// ---------------------------------------------------------------------------------------------------------
// Registeration
app.get('/registration', function(req, res) {
  res.render('registration',{alert:''});
});

//Template for object
var userObj = {
  username:'user',
  password:'password'
  };

app.post('/register', function(req, res) {
  if(!req.body.username || !req.body.password) {
    res.send('Either username or password missing!');
  }
  else {
  userObj.username = req.body.username;
  userObj.password = req.body.password;
  var myFile = fs.readFileSync('database.json');
  var myFileObj = JSON.parse(myFile);
  var flag = true;

  for(var i = 0; i<myFileObj.length; i++) {
    if(myFileObj[i].username === userObj.username) {
      flag = false;
      break;
    }
  }

  if(flag) {
    myFileObj.push(userObj);
    res.render('registration',{alert:'Registeration successful!'});
  }
  else {
    res.render('registration',{alert:'Username already taken!'});
  }

  var userString = JSON.stringify(myFileObj);
  fs.writeFileSync('database.json', userString);
 
}});

// ---------------------------------------------------------------------------------------------------------
// Home Page
app.get('/home', function(req, res) {
    res.render('home');
  });
  
// ---------------------------------
// Category Page
app.get('/drama', function(req, res) {
  res.render('drama');
  });

app.get('/horror', function(req, res) {
  res.render('horror');
  });
  
app.get('/action', function(req, res) {
  res.render('action');
  });

// ---------------------------------------------------------------------------------------------------------
// Movie Page
app.get('/godfather', function(req, res) {
  res.render('godfather', {alert:''});
  });

app.get('/godfather2', function(req, res) {
  res.render('godfather2', {alert:''});
  });

app.get('/conjuring', function(req, res) {
  res.render('conjuring', {alert:''});
  });

app.get('/scream', function(req, res) {
  res.render('scream',{alert:''});
  });

app.get('/darkknight', function(req, res) {
  res.render('darkknight', {alert:''});
  });

app.get('/fightclub', function(req, res) {
  res.render('fightclub',{alert:''});
  });

// ---------------------------------------------------------------------------------------------------------
// Watchlist Page
app.get('/watchlist', function(req, res) {
  var conj = 0, darkknight = 0, godfather = 0, godfathertwo = 0, fightclub = 0, scream = 0;
  
  var watchfile=fs.readFileSync('watchlistdatabase.json');
  var watchfileobj=JSON.parse(watchfile);

  var listofmovies = new Array();
  for(var j = 0; j<watchfileobj.length;j++) {
    if(watchfileobj[j].username===req.session.username) {
      listofmovies.push(watchfileobj[j].moviename);
    }
  }
  for(var i=0; i<listofmovies.length;i++){
    if(listofmovies[i]==='conjuring'){
      conj=i+1;
      }
    if(listofmovies[i]==='darkknight'){
       darkknight=i+1;
     }
    if(listofmovies[i]==='godfather'){
      godfather=i+1;
     }
    if(listofmovies[i]==='godfather2'){
      godfathertwo=i+1;
     }
    if(listofmovies[i]==='fightclub'){
      fightclub=i+1;
      }
    if(listofmovies[i]==='scream'){
      scream=i+1;
  }

  }
  res.render('watchlist', {conjuringinwatchlist:conj, darkknightinwatchlist:darkknight, 
    godfatherinwatchlist:godfather,godfathertwoinwatchlist:godfathertwo,screaminwatchlist:scream,
    fightclubinwatchlist:fightclub});

});

// Watchlist Template  
var movieObj = {
    username: 'username',
    moviename: 'name'
  };

app.post('/watch', function(req, res){
res.redirect('/watchlist');
});

function addwatchlist(name, req, res) { 
      movieObj.username=req.session.username;
      movieObj.moviename=name;
      var watchFile = fs.readFileSync('watchlistdatabase.json');
      var watchFileObj = JSON.parse(watchFile);
      var push=true;
      for(var i = 0; i<watchFileObj.length;i++){
        if(movieObj.moviename===watchFileObj[i].moviename && movieObj.username === watchFileObj[i].username){
          push=false;
          break;
        }
      }
      if(push){
      watchFileObj.push(movieObj);}
      else{
        res.render(name,{alert:'The movie is already added'});
      }
      var watchString = JSON.stringify(watchFileObj);
      fs.writeFileSync('watchlistdatabase.json', watchString);
           
}

app.post('/conjuring', function(req, res){
  addwatchlist('conjuring', req, res);
});

app.post('/darkknight', function(req, res){
  addwatchlist('darkknight', req, res);
});

app.post('/godfather', function(req, res){
  addwatchlist('godfather', req, res);
});

app.post('/godfather2', function(req, res){
  addwatchlist('godfather2', req, res);
});

app.post('/scream', function(req, res){
  addwatchlist('scream', req, res);
});

app.post('/fightclub', function(req, res){
  addwatchlist('fightclub', req, res);
});

// search
var mysearch; 
app.get('/search', function(req, res) {
  var fc="fight club (1999)", conj= "the conjuring (2013)", godfather="the godfather(1972)", godfathertwo="the godfather: part II (1974)", darkknight= "the dark knight (2008)", scream="scream (1996)";
  var conjflag =false, godfatherflag=false, godfathertwoflag=false, darkknightflag=false, fightclubflag=false, screamflag= false;
  
  if(conj.includes(mysearch.toLowerCase())) {
   conjflag = true;
  }
  
  if(godfather.includes(mysearch.toLowerCase())) {
   godfatherflag = true;
  }
 
  if(godfathertwo.includes(mysearch.toLowerCase())) {
   godfathertwoflag = true;
  }
 
  if(darkknight.includes(mysearch.toLowerCase())) {
   darkknightflag = true;
  }
 
  if(fc.includes(mysearch.toLowerCase())) {
   fightclubflag = true;
  }
 
  if(scream.includes(mysearch.toLowerCase())) {
   screamflag = true;
  }
 
  res.render('searchresults', {conjuringinsearch:conjflag, godfatherinsearch:godfatherflag, 
   godfathertwoinsearch:godfathertwoflag, screaminsearch:screamflag, fightclubinsearch:fightclubflag, 
   darkknightinsearch:darkknightflag});
});

app.post('/search',function(req,res){
  mysearch= req.body.Search;
  res.redirect('/search');
});

// Deploying to heroku
if(process.env.PORT) {
  app.listen(process.env.PORT,function(){console.log('Server started')});
}
else {
    app.listen(3000);
}
module.exports = app;
