var express = require('express')
var bodyParser = require('body-parser')
var path = require('path');
var async = require('async');

var html_dir = './reveal/';

var port_num = 3000;

var app = express()
var http = require('http').Server(app);
var io = require('socket.io').listen(http, {'transports': ['websocket', 'polling']});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.use(bodyParser.json())
app.use(express.static(__dirname + '/reveal'));

app.set('views', './reveal');
app.set('view engine', 'ejs');

var twilio = require('twilio');

var client = require('twilio')('ACe31d2cf846642603e2464c0feecc36de', 'b26a01532834a59c0192488a270daa60');


// Load the library
var nStore = require('nstore');
// Create a store
var categories = nStore.new('data/categories.db', function () {
  // It's loaded now
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/reveal','index.html'));
})

app.get('/lecture1', function (req, res) {
  //res.sendFile(path.join(__dirname, '/reveal', 'lecture1.html'));

	// var a_votes = get_votes("A");
	// var b_votes = get_votes("B");

	// categories.get("A", function(err,doc,key){
	// 	if(err) {throw err;}
	// 	else{
	// 		var a_votes = doc.votes ;	
	// 		categories.get("B", function(err,doc,key){
	// 			if(err) {throw err;}
	// 			else{	
	// 				var b_votes = doc.votes ;

	// 				res.render('lecture1', {
	// 				    a_votes: a_votes,
	// 				    b_votes: b_votes
	// 			  	});
	// 			}
	// 		});

	// 	}
	// })

	async.mapSeries(["A","B","P","Q","X","Y"], get_votes_from_db, function(err, results){
    // results is now an array of stats for each file
    if(err){throw err;}
    else {
    	//console.log(results);
    	res.render('lecture1', {
		    a_votes: results[0],
		    b_votes: results[1],
		    p_votes: results[2],
		    q_votes: results[3],
		    x_votes: results[4],
		    y_votes: results[5]
	  	});
    }
	});
});


function get_votes_from_db(arg, callback) {
	categories.get(arg, function(err,doc,key){
		if(err) {throw err;}
		else{	
			//console.log(arg);
			//console.log(doc.votes);
			return callback(null,doc.votes) ;
		}
	});
};

app.get('/init', function (req, res) {
	init();
	res.status(201).send('votes have been reset');
	//res.redirect('https://' + req.get('host')+'/lecture1#/1')
	//console.log ('https://' + req.get('host'));
});

var init = function(){
	categories.save("A", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});
	categories.save("B", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});
	categories.save("P", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});
	categories.save("Q", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});
	categories.save("X", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});
	categories.save("Y", {votes: 0}, function (err) {
    	if (err) { throw err; }
	});

	io.emit('msg', {
		    div: "A",
		    val: 0
		  });

	io.emit('msg', {
		    div: "B",
		    val: 0
		  });
	io.emit('msg', {
		    div: "P",
		    val: 0
		  });

	io.emit('msg', {
		    div: "Q",
		    val: 0
		  });
	io.emit('msg', {
		    div: "X",
		    val: 0
		  });

	io.emit('msg', {
		    div: "Y",
		    val: 0
		  });

	
}

app.get('/twilio', function (req, res) {
	//res.status(404).send('404 Error: Nothing To Show Here!')  
	console.log('get received!')
	var body = req.query.Body;
	var from = req.query.From;
	body = body.trim();	

  	console.log(from);
  	console.log(body);

  	res.status(201).send('Thank you for voting!');

  	process_sms(body);

})

http.listen(port_num, function () {
	init();
  console.log('Server listening on', port_num)
})

var process_sms = function(body) {
  if(body == "A" || body =="a"){
  		console.log ('A Received');
  		increment_vote("A");
  	}else if(body == "B" || body =="b"){
  		console.log ('B Received');
  		increment_vote("B");
  	}else if(body == "P" || body =="p"){
  		console.log ('P Received');
  		increment_vote("P");
  	}else if(body == "Q" || body =="q"){
  		console.log ('Q Received');
  		increment_vote("Q");
  	}else if(body == "X" || body =="x"){
  		console.log ('X Received');
  		increment_vote("X");
  	}else if(body == "Y" || body =="Y"){
  		console.log ('Y Received');
  		increment_vote("Y");
  	}else{
  		console.log ('Unknown Received');
  	}
};

var increment_vote = function(category_name){
	categories.get(category_name, function(err,doc,key){
		if(err) {throw err;}
		else{
			new_votes = doc.votes + 1;
			console.log("incrementing - "+category_name+" : " + new_votes);
			categories.save(category_name, {votes: new_votes}, function (err) {
		    	if (err) { throw err; }
			});

		io.emit('msg', {
		    div: category_name,
		    val: new_votes
		  });

		}
	})
};

var get_votes = function(category_name){
	categories.get(category_name, function(err,doc,key){
		if(err) {throw err;}
		else{
			return doc.votes ;		
		}
	})
}

