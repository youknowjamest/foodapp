var express = require("express")
var router = express.Router({mergeParams: true});
var Post = require("../models/post")
var Comment = require("../models/comment")
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var momenttz = require('moment-timezone')
var moment = require('moment')
var middleware= require("../middleware")


router.get("/new", ensureLoggedIn('/login'), function(req, res) {
    Post.findById(req.params.id, function(err,post){
        if(err){
            console.log(err)
            
        } else {
                res.render("comments/newComment",{post:post})
        }
         
    })
    
});

router.post("/",ensureLoggedIn('/login'),function(req, res){
   //lookup campground using ID
   Post.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
           res.redirect("/posts");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
              comment.author.id = req.user._id;
              comment.author.username = req.user.username;
              comment.created = moment().tz("Singapore").format("LLL");
               //save comment
               comment.save();
               post.comments.push(comment);
               post.save();
               res.json(comment);  
            //res.redirect('/posts/' + post._id);
           }
        });
       };
   });
});

//edit comment

router.get("/:commentID/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.commentID,function(err,comment){
        if(err){
            res.redirect("back")
        }   else {
             res.render("comments/editComment",{postID:req.params.id ,comment:comment})
        }
    })
})

router.get("/",ensureLoggedIn('/login'),function(req,res){
    Post.findById(req.params.id).populate("comments").exec(function(err,post){
        if(err){
            console.log(err);
        } else {
                res.render("posts/show",{post:post});
        }
    });
});

router.put("/:commentID",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentID,req.body.comment,{ new: true },function(err,updated){
        if(err){
            res.redirect("back");
        }   else{
            // res.redirect("/posts/"+req.params.id);
            res.json(updated);
        }
    });
  
});
//////////////COMMENT REMOVE ROUTE
router.delete("/:commentID",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.commentID,function(err){
        if(err){
            res.redirect("back")
        }   else {
            req.flash("success","Comment was deleted.")
            res.redirect("/posts/"+req.params.id)
        }
    })
})


module.exports = router