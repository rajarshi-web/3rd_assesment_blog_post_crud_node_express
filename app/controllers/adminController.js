const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");


class AdminController {

  async loginPage(req, res){
  try {
    res.render("admin/auth/login", { layout: false });
  } catch (err) {
    console.log(err);
  }
};

async login(req, res){
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.redirect("/admin");

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.redirect("/admin");

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.redirect("/admin");

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET_ADMIN,
      { expiresIn: "8h" }
    );

    res.cookie("adminToken", token);
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.log(err);
  }
}

async dashboard(req, res){
  try {

    const users = await User.countDocuments();
    const blogs = await Blog.countDocuments();

    res.render("admin/dashboard", {
      layout: "layouts/admin",
      admin: req.user,
      users,
      blogs
    });

  } catch (err) {
    console.log(err);
  }
}

async logout(req, res){
  try {
    res.clearCookie("adminToken");
    req.session.destroy(err => {
    if (err) console.log(err);

    res.clearCookie("connect.sid");
    res.redirect("/admin");
  });
  } catch (err) {
    console.log(err);
  }
}



/* ================= USER CRUD (ADMIN) ================= */

async users(req, res){
  try {
    const users = await User.find({ role: "user" });
    res.render("admin/users/index", {
      layout: "layouts/admin",
      admin: req.user,
      users
    });
  } catch (err) {
    console.log(err);
  }
}

async userCreateForm(req, res){
  try {
    res.render("admin/users/create");
  } catch (err) {
    console.log(err);
  }
}

async userCreate(req, res){
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash, role: "user" });
    res.redirect("/admin/users");
  } catch (err) {
    console.log(err);
  }
}

async userDelete(req, res){
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    console.log(err);
  }
}

/* ================= BLOG CRUD (ADMIN – HARD DELETE) ================= */

async blogs(req, res){
  try {
    const blogs = await Blog.find().populate("author");
    res.render("admin/blogs/index", {
      layout: "layouts/admin",
      admin: req.user,
      blogs
    });
  } catch (err) {
    console.log(err);
  }
}

async blogEditForm(req, res){
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("admin/blogs/edit", { blog });
  } catch (err) {
    console.log(err);
  }
}

async blogUpdate(req, res){
  try {
    let image;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      image = upload.secure_url;
    }

    await Blog.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(","),
      ...(image && { image })
    });

    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
}

async blogDelete(req, res){
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/admin/blogs");
  } catch (err) {
    console.log(err);
  }
}
}
module.exports = new AdminController();