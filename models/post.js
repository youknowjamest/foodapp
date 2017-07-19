var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var postSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments:[
	    {
	        type:mongoose.Schema.Types.ObjectId,
	        ref:"Comment"
		}
	],
	author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: {
      	type:String,
      	sparse:true}
   	},
   	created:{
   		type: Date, 
   		default: Date.now
    	}
});

postSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Post", postSchema);