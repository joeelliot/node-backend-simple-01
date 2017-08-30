var express = require('express');
var bodyParser = require('body-parser');
var path    = require("path");
var mongo = require('mongojs');
var db = mongo('localhost:27017/qrcode',['siths']);

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

var port = process.env.PORT || 8888;

app.use(express.static(__dirname + '/views'));

var router = express.Router();

router.route('/qrcode')
  .post(function(req, res){
    db.siths.insert({
      sith01: req.body.sith01,
      sith02: req.body.sith02,
      sith03: req.body.sith03,
      sith04: req.body.sith04,
      sith05: req.body.sith05,
      sith06: req.body.sith06,
      sith07: req.body.sith07,
      sith08: req.body.sith08,
      sith09: req.body.sith09,
      sith10: req.body.sith10,


      created_at: new Date()
    }, function(err, items){
      if(err)
        res.send(err);

      //res.json(items);
      console.log('JSON: '+JSON.stringify(items));
      io.emit('message', items);

      res.writeHead(200, {"Content-Type": "text/plain"});
      res.write("success");
      res.end();
    });
  })
  .get(function(req, res){
    db.siths.find({}, function(err, items){
      if(err)
        res.send(err);

        res.json(items);
    });
  });

router.route('/qrcode/:id')
  .delete(function (req, res) {
    db.siths.remove({_id: mongo.ObjectId(req.params.id)}, function(err, items){
      if(err){
        res.send(err);
      }else {
        res.json({message: "Item ID: "+req.params.id+" Successfully Deleted"});
      }
    })
  });

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('message', function(msg){
    console.log('message: ' + msg);
  });
});

app.use('/api', router);

http.listen(port, function(){
  console.log('listening on *:'+port);
});
