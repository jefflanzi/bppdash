var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../app');

// Set up server
var base = 'http://localhost'
var server;
var testuser = {
  username: 'admin',
  usertype: 'site admin',
  password: 'admin'
}

before(function() {

  server = app.listen(0, function listening() {
    base += ':' + server.address().port;
  });

});

after(function() {
  server.close();
});

describe('/login', function() {

  it('should not allow unauthenticated access', function(done) {
    request(app)
      .get('/user')
      .end(function(err, res) {
        if (err) throw err;
        // console.log("res keys: ", Object.keys(res))
        console.log("unauthenticated request: ", res.text);
        expect(res.text).to.equal('not authorized');
        done();
      })
  });

  var agent = request.agent(app);

  it('should accept credentials on /login', function(done) {
    agent
      .post('/login')
      .send({ username: testuser.username, password: testuser.password })
      .end(function(err, res) {
        if (err) throw err;
        // console.log("res keys: ", Object.keys(res))
        console.log("login: ", res.text);
        expect(res.text).to.equal('Found. Redirecting to /')
        done();
      });
  });

  it('should retain session cookies across requests', function(done) {
    agent
      .get('/user')
      .end(function(err, res) {
        if (err) throw err;
        // console.log("res keys: ", Object.keys(res))
        console.log('get /user:', res.text);
        expect(res.body[0]).to.be.a('object');
        expect(res.body[0]).to.be.have.property('username');
        done();
      });
  });

});
