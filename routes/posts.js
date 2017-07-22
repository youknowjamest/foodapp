var express = require("express")
var router = express.Router({mergeParams: true});
var Post = require("../models/post")
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var middleware= require("../middleware")



router.get("/",function(req,res){
    var noMatch=null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); 
        Post.find({name:regex},function(err,posts){
            if(err){
                console.log(err)
            }   
            
            else{
                if(posts.length<1){
                    noMatch="Your search query did not return any results!"
                    console.log(noMatch)
                };
                
                res.render("posts/posts",{postsList:posts , noMatch:noMatch})  
            }
        })  
    }   else {
            Post.find({},function(err,posts){
                if(err){
                    console.log(err)
                } else {
                 res.render("posts/posts",{postsList:posts , noMatch:noMatch})
                }    
            })
    }
})

router.get("/new",ensureLoggedIn('/login'), function(req,res){
    res.render("posts/new")
})

router.post("/", ensureLoggedIn('/login'),function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newpost = {name: name, image: image, description: desc, author: author}
    // Create a new campground and save to DB
    Post.create(newpost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to posts page
            res.redirect("/posts");
        }
    });
});

router.get("/:id", function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err,post){
        if(err){
            console.log(err)
        } else {
                res.render("posts/show",{post:post})
        }
    })
})
///////////////UPDATE 
router.get("/:id/edit",middleware.checkPostOwnership, function(req, res) {
    Post.findById(req.params.id,function(err,found){
        if(err){
            console.log(err)
        }   else{
            res.render("posts/edit",{post:found})
        }
    })
})

router.put("/:id",middleware.checkPostOwnership,function(req,res){
    Post.findByIdAndUpdate(req.params.id,req.body.updated,function(err,updated){
        if(err){
            res.redirect("back")
        }   else {
            res.redirect("/posts/"+ req.params.id)
        }
    
    })
    
})
///////////////DESTROY
router.delete("/:id",middleware.checkPostOwnership,function(req,res){
    Post.findByIdAndRemove(req.params.id,function(err){
           if(err){
            res.redirect("/posts")
        } else {
            res.redirect("/posts")
        }
    })
})

///////////middleware




//////////////////
function escapeRegex(text) { 
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); 
}; 


module.exports = router;