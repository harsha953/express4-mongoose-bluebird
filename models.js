var _ = require('underscore'),
    mongoose = require('mongoose'),
    Promise = require('bluebird')

mongoose.connect('localhost/dev')

var schema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true}
})

schema.set('toJSON', {
  transform: function(doc, ret) {
    return _.pick(ret, 'title', 'body', '_id')
  }
})

var Post = mongoose.model('Post', schema)
Promise.promisifyAll(Post)
Promise.promisifyAll(Post.prototype)

exports.Post = Post
