var express = require('express')
	, connect = require('connect')
	, sessions = require('express-session')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
    , passport = require('passport')
    , LocalStrategy = require('passport-local')
    , mongoose = require('mongoose')
    , cors = require('cors');


var heroku = process.env.HEROKU_TRUE || false

app.set('view engine', 'jade');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', heroku ? 'https://mulligan-fund.github.io' : 'http://127.0.0.1:4000');
    next();
});

app.use(morgan('dev'));  
app.use(bodyParser());
app.use(sessions({ secret: 'wowfoundations'
					 ,cookie:
					    { secure: false
					    , httpOnly: false } } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
	credentials: true
	, preflightContinue: true
	, allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept"
	, origin: ['http://127.0.0.1:4000','https://mulligan-fund.github.io/']
	}));
app.use(methodOverride());


// Mongoose
var schema = require('./schema.js');
var User = require('./user.js');
var Obj = require('./object.js');
var Role = require('./title.js');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/grantcalc'); //process.env.MONGODB_URI || 


//Bootstrap titles, remove this in prod
// var titles = [
// 	{ 'title':'CEO', 'salary':200000}
// 	, { 'title':'COO', 'salary':150000}
// 	, { 'title':'Lacky', 'salary':4000}
// 	, { 'title':'Analyst', 'salary':40000}
// 	, { 'title':'Intern', 'salary':3200}
// ]

// for(var i in titles) {
// 	var gg = new Role(titles[i])
// 	gg.save()
// }

//Bootstrap ppl, remove this in prod
// var ppl = [
// 	{ 'name':'Person 1', 'userid': '5a3ebaf915a1118aef083a7e', 'title': '5a3ec0ec79c3078c31d5cf57' ,'salary':200000}
// 	, { 'name':'Person 2', 'userid': '5a3ebaf915a1118aef083a7e', 'title': '5a3ec0ec79c3078c31d5cf57' ,'salary':200}
// 	, { 'name':'Person 3', 'userid': '5a3ebaf915a1118aef083a7e', 'title': '5a3ec0ec79c3078c31d5cf57' ,'salary':20000}
// 	, { 'name':'Person 4', 'userid': '5a3ebaf915a1118aef083a7e', 'title': '5a3ec0ec79c3078c31d5cf57' ,'salary':400000}
// 	, { 'name':'Person 5', 'userid': '5a3ebaf915a1118aef083a7e', 'title': '5a3ec0ec79c3078c31d5cf57' ,'salary':370000}
// ]

// for(var i in ppl) {
// 	var gg = new Obj(ppl[i])
// 	gg.save()
// }

passport.serializeUser(function(user, done) {
	console.log("serializeUser")
	console.log(user)
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

var heroku = process.env.HEROKU_TRUE || false

passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
  function(username, password, done) {
  	console.log("Looking for",username,password)
    User.findOne({ username: username }, function (err, user) {
    	console.log("Looking for user",user,err)

		if (err) { console.log(err); return done(err); }

		if (!user) { 
			console.log("Making user")
		     usr = new User({ username: username, password: password });
		     usr.save(function(err) {
			     if(err) {
			           console.log(err);
			     } else {
			           console.log('user: ' + usr.username + " saved.");
			           done(null,usr)
			     }
		  });
		}

		if(user) {
			if(user.comparePassword( password )) {
				done(null,user)
			} else {
				return done(null,false, {message: 'Invalid password'});
			}
		}
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { console.log("Authenticated"); return next(); }
  else {
  	console.log("Not Authenticated");
	res.setHeader('Content-Type', 'application/json');	
	res.status(401).send(JSON.stringify("Not Logged In"))
  }
}

app.options('*', cors({credentials: true, origin: ['http://127.0.0.1:4000','https://mulligan-fund.github.io']})); // Setup CORS option

app.get('/', function(req,res) {
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("No Login"))
})

// Authenticate
app.put('/auth',
  passport.authenticate('local'),
  function(req, res) {
  	console.log("Punted through")
  	res.setHeader('Content-Type', 'application/json');	
	res.status(202).send(JSON.stringify("./list"))
});

// Check if authenticated
app.get('/auth', ensureAuthenticated, function(req,res,next){
	res.setHeader('Content-Type', 'application/json');	
	res.status(200).send(JSON.stringify(req.user))
});

// Main index
app.put('/', ensureAuthenticated, function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("Logged in"))
});

app.get('/logout',  function(req, res){
  req.logout();
  res.setHeader('Content-Type', 'application/json');	
  res.send(JSON.stringify("Error login"))
});

//////////////////////////////////
////////////// USER //////////////
//////////////////////////////////
app.get('/user', ensureAuthenticated,function(req,res,next){
	// Get User info here
	res.setHeader('Content-Type', 'application/json');	
	res.send(JSON.stringify("User info should return"))
})

app.put("/user", ensureAuthenticated,function(req,res,next){
	console.log("Updating user",req.query)
	User.findOneAndUpdate(
	{id:req.user.id}, 
		update(),
		{upsert:true}, function(err,user){
			if(err) {
				console.log("user update fail :(",err)
				res.sendStatus(500)
			} else {
				console.log("user update success",user)
				res.sendStatus(200)
			}
	})		
})



//////////////////////////////////////
/////////////  Items  ////////////////
//////////////////////////////////////


app.get('/grant/:id?', ensureAuthenticated, function(req, res, next) {
	var items = []
	User.findById(req.user._id,function(err,user){
		if(err)  {
			console.log("Some kind of error fetching user",err)
			res.sendStatus(400,err)
		}
		if(req.query.list) {
			schema.find({userid:req.user._id}, function(err,list) {
				console.log("/grant list",list)
				if(err)  {
					console.log("Some kind of error fetching grant",err)
					res.sendStatus(400,err)
				}
				res.setHeader('Content-Type', 'application/json');	
		    	res.status(200).send(list)
			})
		} else {
			schema.findById(req.query.id,function(err,grant){
				console.log("/grant grant",grant)
				if(err)  {
					console.log("Some kind of error fetching grant",err)
					res.sendStatus(400,err)
				}
				res.setHeader('Content-Type', 'application/json');	
		    	res.status(200).send(grant)
		    })
		}
	})
})

app.put('/grant/:id?', ensureAuthenticated, function(req,res,next) {
	var items = []
	console.log("req.user for /items",req.user)

	// Is this a new grant?	
	if(req.body._id==null) {
		console.log("Looks like a new grant")
		grant = new schema();
		grant.userid = req.user.id
		for(var i in req.body) {
			grant[i] = req.body[i]
		}
		grant.save(function(err,grant){
			if(err) console.log("Error creating grant",err,grant)
			res.setHeader('Content-Type', 'application/json');	
	    	res.status(200).send(grant)
		})
		
	} else {
		User.findById(req.user._id,function(err,user){
			console.log("/grant user",user)
			if(err)  {
				console.log("Some kind of error fetching pins",err)
				res.sendStatus(400,err)
			}

			if(user.username == null) {
				res.sendStatus(400,err)	
			} else {
			console.log("Returned user",user)
			console.log("To insert",req.body)

			schema.findByIdAndUpdate(req.body._id ,req.body,
	          {upsert: false, new: true},
	          function(err,grant){
	           if(err) console.log("Updated form")
	                res.setHeader('Content-Type', 'application/json');	
					res.send(JSON.stringify(grant))
	        })
			
			}
		}) 
	}
})

//////////////////////////////////////
/////////////  Items  ////////////////
//////////////////////////////////////

app.get('/role/:id?', ensureAuthenticated, function(req, res, next) {
	var items = []
	Role.find({}, function(err,list) {
		if(err)  {
			console.log("Some kind of error fetching roles",err)
			res.sendStatus(400,err)
		}
		res.setHeader('Content-Type', 'application/json');	
    	res.status(200).send(list)
	})
})

app.get('/object/:id?', ensureAuthenticated, function(req, res, next) {
	var items = []
	User.findById(req.user._id,function(err,user){
		if(err)  {
			console.log("Some kind of error fetching user",err)
			res.sendStatus(400,err)
		}
		if(req.query.list) {
			console.log("for list",req.user._id)
			Obj.find({userid: req.user._id}, function(err,list) {
				console.log("/object list",list)
				if(err)  {
					console.log("Some kind of error fetching Ppl List",err)
					res.sendStatus(400,err)
				}
				res.setHeader('Content-Type', 'application/json');	
		    	res.status(200).send(list)
			})
		} else {
			Obj.findById(req.query.id,function(err,o){
				console.log("/object object",o)
				if(err)  {
					console.log("Some kind of error fetching object",err)
					res.sendStatus(400,err)
				}
				res.setHeader('Content-Type', 'application/json');	
		    	res.status(200).send(o)
		    })
		}
	})
})

app.put('/object/:id?', ensureAuthenticated, function(req,res,next) {
	var items = []
	console.log("req.user for /items",req.user)

	// Is this a new grant?	
	if(req.body._id==null) {
		console.log("Looks like a new grant")
		object = new Obj();
		object.userid = req.user.id
		for(var i in req.body) {
			object[i] = req.body[i]
		}
		object.save(function(err,o){
			if(err) console.log("Error creating grant",err,o)
			res.setHeader('Content-Type', 'application/json');	
	    	res.status(200).send(o)
		})
		
	} else {
		User.findById(req.user._id,function(err,user){
			console.log("/object user",user)
			if(err)  {
				console.log("Some kind of error fetching pins",err)
				res.sendStatus(400,err)
			}

			if(user.username == null) {
				res.sendStatus(400,err)	
			} else {
			console.log("Returned user",user)
			console.log("To insert",req.body)

			Obj.findByIdAndUpdate(req.body._id ,req.body,
	          {upsert: false, new: true},
	          function(err,o){
	           if(err) console.log("Updated obj")
	                res.setHeader('Content-Type', 'application/json');	
					res.send(JSON.stringify(o))
	        })
			
			}
		}) 
	}
})



app.listen(port);
console.log('App running on port', port);