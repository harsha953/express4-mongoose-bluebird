var express = require('express'),
    logger = require('morgan')

var app = express();

var env = process.env.NODE_ENV || 'development';
var silent = env === 'test'

app.set('port', +process.env.PORT || 3000)
if (env === 'development') {
  app.use(logger('dev'))
} else {
  app.use(logger())
}
app.use(require('body-parser')())
app.use(require('method-override')())

app.use('/post', require('./routes'))

app.use(function handleNotFound(req, res){
  res.status(404);

  // if (req.accepts('html')) {
  //   res.render('404', { url: req.url });
  //   return;
  // }

  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send('Not found');
})

if (env === 'development') {
  app.use(require('errorhandler')())

} else {
  app.use(function logErrors(err, req, res, next){
    if (err.status === 404) {
      return next(err)
    }

    if (err.logError === false) {
      return next(err)
    }

    console.error(err.stack)
    next(err)
  })

  app.use(function respondError(err, req, res, next){
    var status, message

    status = err.status || 500
    res.status(status)

    message = ((err.productionMessage && err.message) ||
      err.customProductionMessage)

    if (!message) {
      if (status === 403) {
        message = 'Not allowed'
      } else {
        message = 'Oops, there was a problem!'
      }
    }

    if (req.accepts('json')) {
      res.send({error: message})
      return

    } else {
      res.type('txt').send(message + '\n')
      return
    }

  })
}

if (!module.parent) {
  app.listen(app.get('port'))
  if (!silent) {
    console.log('Server listening on port ' + app.get('port'))
  }
}
