var express = require('express'),
    Post = require('./models').Post,
    ValidationError = require('mongoose/lib/error/validation')

var postRouter = express.Router()
var objectIdRegex = /\d{8}|\d{16}/

postRouter.param('post', function(req, res, next, id) {
  if (! objectIdRegex.test(String(id))) {
    return next('route')
  }

  Post.findByIdAsync(id).then(function(found) {
    if (!found) {
      return next('route')
    }

    req.paramPost = found
    next()

  }).catch(next)
})

postRouter.get('/', function(req, res, next) {
  Post.findAsync().then(function(foundItems){
    res.send(foundItems)
  }).catch(next)
})

postRouter.post('/', function(req, res, next) {
  Post.createAsync(req.body).then(function(item) {
    res.send(201, item)
  }).catch(ValidationError, function(err) {
    err.logError = false
    err.productionMessage = true
    throw err
  }).catch(next)
})

postRouter.get('/:post', function(req, res) {
  res.send(req.paramPost)
})

postRouter.put('/:post', function(req, res, next) {
  req.paramPost.set(req.body)
  req.paramPost.saveAsync().then(function(updatedItem) {
    res.send(updatedItem)

  }).catch(ValidationError, function(err) {
    err.logError = false
    err.productionMessage = true
    throw err
  }).catch(next)
})

postRouter.delete('/:postId', function(req, res, next) {
  var postId = String(req.params.postId)
  if (! objectIdRegex.test(postId)) {
    return next('route')
  }

  Post.findByIdAndRemoveAsync(postId).then(function(deletedItem) {
    res.send(deletedItem)
  }).catch(next)
})

module.exports = exports = postRouter
