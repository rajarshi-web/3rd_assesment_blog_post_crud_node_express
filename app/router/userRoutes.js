const express= require('express');

const upload = require("../middleware/videoUpload");
const uploadImage=require("../middleware/imageUpload");
const user=require("../controllers/UserController");



const AuthCheckAdmin = require('../middleware/adminAuthCheck');


const router=express.Router()

router.get("/register", user.registerPage);
router.post("/register", user.register);

router.get("/login", user.loginPage);
router.post("/login", user.login);
router.get("/logout", user.logout);

router.get("/dashboard", AuthCheckAdmin, user.blogs);

/* BLOGS */
router.get("/blogs", AuthCheckAdmin, user.blogs);
router.get("/blogs/create", AuthCheckAdmin, user.blogCreateForm);
router.post("/blogs/create", AuthCheckAdmin, uploadImage.single("image"), user.blogCreate);
router.get("/blogs/edit/:id", AuthCheckAdmin, user.blogEditForm);
router.post("/blogs/edit/:id", AuthCheckAdmin, user.blogUpdate);
router.post("/blogs/delete/:id", AuthCheckAdmin, user.blogDelete);

module.exports = router;
