const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  tags: [
    {
      type: String,
      trim: true
    }
  ],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

blogSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("blog", blogSchema);

