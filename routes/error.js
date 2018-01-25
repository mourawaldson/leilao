"use strict";

let express = require('express'),
    router = express.Router();

router.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});

router.get('/403', function(req, res, next){
  // trigger a 403 error
  let err = new Error('Not allowed!');
  err.status = 403;
  next(err);
});

router.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"

router.use(function(req, res, next){
  res.status(404);
  const message404 = 'Página não encontrada!';

  // respond with html page
  if (req.accepts('html')) {
    res.render('error', {
        url: req.url,
        message: message404,
        title: 'Ohhh! =/',
        description: message404
    });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: message404 });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send(message404);
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

// 500

// development error handler, will print stacktrace
// production error handler, no stacktraces leaked to user
router.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: (router.get('env') === 'development') ? err : {}
    });
});

module.exports = router;
