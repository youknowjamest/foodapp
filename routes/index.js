var express = require("express")
var router = express.Router({mergeParams: true});
var passport= require("passport")
var User = require("../models/user")
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
//landing page
router.get("/",function(req,res){
    res.render("home")
})

//AUTHENTICATION 

router.get("/register",function(req,res){
	res.render("register")
})

router.post("/register",function(req,res){
    
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
    	if(err){
        	req.flash("error",err.message);
        	return res.redirect("/register");
    	    
    	}

        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome " + user.username+"!");
    	    res.redirect("/");
        });
    });
});

router.get("/login",function ( req, res) {
	res.render("login")
})

router.post("/login", passport.authenticate("local" , { successReturnToOrRedirect:  "/posts", failureRedirect: "/login"}),  function( req, res){
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","You have successfully logged out!")
	res.redirect("/posts");
});




///////////////
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	return next();
}
res.redirect("/login")
}

module.exports = router