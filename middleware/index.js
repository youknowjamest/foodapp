var Post      = require("../models/post"),
    Comment   = require("../models/comment");

var middlewareObj = {
        checkPostOwnership : function(req,res,next){
    	//check if user is logged in
        	if(req.isAuthenticated()){
        			Post.findById(req.params.id,function(err,found){
        	        	if(err) {
        	            	res.redirect("back");
        	        	}   else {
        						//does user own the post
        						//( here we compare the author of the post to the currently logged in user)
        						if(found.author.id.equals(req.user._id)){
        			    			next();
        						}	else{
        							res.redirect("back")
        						}
        				}
        	    	});
        	} else {
                res.redirect("back");
            }
        },
        
        checkCommentOwnership: function(req,res,next){
        	//check if user is logged in
        	if(req.isAuthenticated()){
        			Comment.findById(req.params.commentID,function(err,found){
        	        	if(err) {
        	            	res.redirect("back");
        	        	}   else {
        						//does user own the comment
        						//( here we compare the author of the comment to the currently logged in user)
        						if(found.author.id.equals(req.user._id)){
        			    			next();
        						}	else{
        							res.redirect("back")
        						}
        				}
        	    	});
        	} else {
        		res.redirect("back");
        	}
        }
 }

module.exports=middlewareObj