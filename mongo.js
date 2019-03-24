const mongoose = require('mongoose')

const mongoUrl = 'mongodb://sdgdsgsdg:sdgsdgsd@ds149895.mlab.com:49994/blogilista'
mongoose.connect(mongoUrl)
mongoose.Promise = global.Promise

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

Blog
  .find({})
  .then(result => {
    result.forEach(blog => {
      console.log(blog)
    })
    mongoose.connection.close()
  })