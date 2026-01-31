const express= require('express');

const upload = require("../middleware/videoUpload");
const uploadImage=require("../middleware/imageUpload");
const admin=require("../controllers/adminController");

const AuthCheckAdmin = require('../middleware/adminAuthCheck');


const router=express.Router()


router.get("/", admin.loginPage);
router.post("/login", admin.login);

router.get("/dashboard", AuthCheckAdmin, admin.dashboard);
router.get("/logout", AuthCheckAdmin, admin.logout);

/* USERS */
router.get("/users", AuthCheckAdmin, admin.users);
router.get("/users/create", AuthCheckAdmin, admin.userCreateForm);
router.post("/users/create", AuthCheckAdmin, admin.userCreate);
router.post("/users/delete/:id", AuthCheckAdmin, admin.userDelete);

/* BLOGS */
router.get("/blogs", AuthCheckAdmin, admin.blogs);
router.get("/blogs/edit/:id", AuthCheckAdmin, admin.blogEditForm);
router.post("/blogs/edit/:id", AuthCheckAdmin, uploadImage.single("image"), admin.blogUpdate);
router.post("/blogs/delete/:id", AuthCheckAdmin, admin.blogDelete);



module.exports = router;
