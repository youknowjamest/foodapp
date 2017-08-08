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
	res.render("register",{page: 'register'})
})

router.get("/about",function(req,res){
    res.render("about",{page:'about'})
})

router.post("/register",function(req,res){
    
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
    	if(err){
        	req.flash("error",err.message);
        	return res.redirect("/register");
    	    
    	}

        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome " + user.username+"!");
    	    res.redirect("/posts");
        });
    });
});

// router.get("/login",function ( req, res) {
// 	res.render("login",{page: 'login'})
// })

router.get("/login",function(req, res,next) {
        if(req.isAuthenticated()){
            res.redirect("/posts");
        };
        req.session.redirectTo =  req.headers.referrer || req.headers.referer;
        next();
    },function (req, res) {
    	res.render("login",{page: 'login'})
})

// router.post("/login", passport.authenticate("local" , { successReturnToOrRedirect:  "/posts", failureRedirect: "/login", successFlash: "Welcome " +"!"}),  function( req, res){
// });
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/posts';
      delete req.session.redirectTo;
      req.flash("success","Welcome " + req.user.username+"!");
      res.redirect(redirectTo);
    });
  })(req, res, next);
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