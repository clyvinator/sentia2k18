module.exports = function(app) {
  app.post('/login', function(req, res) {
    console.log(req);
    console.log("TESTING");
    app.models.SentiaUser.login({
      email: req.body.email,
      password: req.body.password
    }, 'SentiaUser', function(err, token) {
      if (err) {
        res.send('<a href="/">YA FAILED</a>');
        return;
      }
      res.cookie('access_token', token.id, { signed: true , maxAge: 300000 });
      // res.set('X-Access-Token', token.id);
      res.render('token', {
        email: req.body.email,
        accessToken: token.id
      });
    });
  });

  app.get('/token', function(req, res) {
      res.render('token');
  });
};