var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    // created:{
    //     type: Date, 
    //     default: Date.now
        
    // }
        created: String
    // author: String
});

commentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Comment",commentSchema);