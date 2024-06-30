const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   username: { 
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
},
 email: {
    type: String,
    require: true,
    max: 50,
    unique: true,
 },
 password: {
        type: String,
        require: true,
        min : 8,
 },
 avatarImage:{
    type : String,
    default:""
 },
 isAvatarImageSet:{
    type: Boolean,
    default: false,
 } ,
});

module.exports = mongoose.model("Users" , userSchema);