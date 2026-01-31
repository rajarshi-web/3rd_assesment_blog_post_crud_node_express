const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    role: 
    { 
      type: String, 
      enum: ["user", "admin"], 
      default: "user" 
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

userSchema.index({ name: "String", email: "String", phone: "String" });
const UserModel = mongoose.model('user',userSchema);
module.exports = UserModel;