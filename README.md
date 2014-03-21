express4-bluebird-mongoose
========

This is just a test that combines the upcoming express version and
a couple of things I wanted to try for a while.

Express4
------

I was curious about some of the new features of express4. This uses the new
`express.Router` API and obviously the now not-included-by-default middlewares

Better error handling in production
-----

First is letting express handle most of the errors and the display, even in
production. This comes because I found myself doing pretty poor error handling
such as

    if (err) res.send(500)

or copying and pasting validation feedback all over the place.

Using bluebird with mongoose
-------

I'm currently in love with [bluebird](https://github.com/petkaantonov/bluebird)
and not quite thrilled with the current mpromise-based implementation.

I found recently [this issue](https://github.com/yamadapc/mongoose-bluebird-utils/issues/1)
where the author stated that you can indeed use bluebird with mongoose, so
this is the experiment where I test that, even if superficially.

Interesting stuff
-------

I love the combination of bluebird + the aforementioned error handling so
everything can be handled with `.catch(next)`. Also of interest is the handling
of `ValidationError` when the model fails to pass validation.

Running
-------

Just clone, `npm install` and `npm start`. It should run, provided you have a
local installation of mongodb

