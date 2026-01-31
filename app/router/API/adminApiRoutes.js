const express= require('express');

const upload = require("../../middleware/videoUpload");
const uploadImage=require("../../middleware/imageUpload");
const admin=require("../../controllers/API/adminApiController");

const AuthCheck= require('../../middleware/adminAuthCheck');


const router=express.Router()


router.post('/login',admin.Login)
router.post('/register',admin.Register)





module.exports = router;