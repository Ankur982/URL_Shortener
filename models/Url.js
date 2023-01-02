const mongoose = require("mongoose");


const UrlSchema = new mongoose.Schema({

  urlCode: {
    type: String,
    required: true
  },
  longUrl: {
    type: String,
    required: true,
    unique: true
  },
  shortUrl: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now
  },
  uses: {
    type: Number,
    required: true,
  }

}, { timestamps: true });


module.exports = mongoose.model("Url", UrlSchema);