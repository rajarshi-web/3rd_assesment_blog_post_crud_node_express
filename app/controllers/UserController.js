const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const { hashedPassword } = require("../helper/hashedPassword");


class UserController {
/* ================= AUTH ================= */

async registerPage(req, res){
  try {
    res.render("user/auth/register", { layout: false });
  } catch (err) {
    console.log(err);
  }
};

async register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !password || (!email && !phone)) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    // Check existing email
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error", "User already exists");
        return res.redirect("/register");
      }
    }

    // Hash password
    const haspassword = await hashedPassword(password);

    // Create user
    const userdata = new User({
      role: "user",
      name,
      email,
      phone,
      password: haspassword
    });

    await userdata.save();

    // Flash message
    req.flash("success", "Registration successful. Please login.");

    // Redirect to login
    return res.redirect("/");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/register");
  }
}
async loginPage(req, res){
  try {
    res.render("user/auth/login");
  } catch (err) {
    console.log(err);
  }
}

async login(req, res){
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.redirect("/login");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.redirect("/login");

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
}

async dashboard(req, res){
  try {
    res.render("user/dashboard", {
                layout: "layouts/user",
                user: req.user
          });
  } catch (err) {
    console.log(err);
  }
}

async logout(req, res){
  try {
    req.session.destroy(() => res.redirect("/login"));
  } catch (err) {
    console.log(err);
  }
};

/* ================= BLOG CRUD (USER – SOFT DELETE) ================= */

async blogs(req, res){
  try {
    const blogs = await Blog.find({
      author: req.session.user._id,
      isDeleted: false
    });
    res.render("blogs/index", { blogs });
  } catch (err) {
    console.log(err);
  }
}

async blogCreateForm(req, res){
  try {
    res.render("blogs/create");
  } catch (err) {
    console.log(err);
  }
}

async blogCreate(req, res){
  try {
    let image;
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      image = upload.secure_url;
    }

    await Blog.create({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(","),
      image,
      author: req.session.user._id
    });

    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
  }
}

async blogEditForm(req, res){
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.author.toString() !== req.session.user._id.toString())
      return res.redirect("/blogs");

    res.render("blogs/edit", { blog });
  } catch (err) {
    console.log(err);
  }
}

async blogUpdate(req, res){
  try {
    await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.session.user._id },
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags.split(",")
      }
    );
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
  }
}

async blogDelete(req, res){
  try {
    await Blog.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.redirect("/blogs");
  } catch (err) {
    console.log(err);
  }
}

}
module.exports = new UserController();
