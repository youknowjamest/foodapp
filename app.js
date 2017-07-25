var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    Comment                 = require("./models/comment") ,
    Post                    = require("./models/post"),
    User                    = require("./models/user"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalStrategy   = require("passport-local-mongoose"),
    MethodOverride          = require("method-override")
    
var commentRoutes    = require("./routes/comments"),
    postRoutes       = require("./routes/posts"),
    indexRoutes      = require("./routes/index")

// seedDB();

//FLASH
var flash = require("connect-flash");
app.use(flash())

// mongoose.connect("mongodb://localhost/foodpage");
mongoose.connect(process.env.DATABASEURI);
// mongoose.connect("mongodb://dreambeats:dreambeats@ds147882.mlab.com:47882/food");
mongoose.Promise = global.Promise; //this is to remove an error msg, we arent using promises
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(MethodOverride("_method"));
app.use(require("express-session")({
	secret:"ANY TEXT HERE",
	resave: false,
	saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success=req.flash("success");
   res.locals.moment=require("moment")
   next();
});


app.use("/posts/:id/comments/",commentRoutes);
app.use("/posts/",postRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,process.env.IP, function(){
	console.log(" server has started!")
})

console.log(process.env.DATABASEURI)