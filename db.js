var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/cs498rk', function () {
  console.log('mongodb connected')
})
module.exports = mongoose