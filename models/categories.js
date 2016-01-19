// var db = require('../db')
// var Categories = db.model('Categories', {
//   name: { type: String, required: true },
//   votes:     { type: Number, required: true, default: 0 },
// })
// module.exports = Categories

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
  name: { type: String, required: true },
  votes:     { type: Number, required: true, default: 0 },
});

mongoose.model('Categories', CategoriesSchema);