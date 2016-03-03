process.env.NODE_ENV = 'test';
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');
var User = require('../models/user');

// Set up agent to hold auth credentials
var agent = request.agent(app);

// Create mock users
var testAdmin = new User({
  username: 'testadmin',
  usertype: 'site admin',
  password: 'admin'
});

var newUser = {
  username: 'newtestuser',
  usertype: 'site admin',
  password: 'test'
};


before(function(done) {

  if(mongoose.connection.readyState === 1) {
    done();
  } else {
    mongoose.connection.once('open', done);
  }

});

describe('*SETUP*', function() {

  before(function(done) {
    User.remove({}, function(err) {
      if (err) throw err;
      console.log('+User collection removed');
      done();
    });
  })

  it('can create an admin if none exist', function(done) {
    request(app)
      .post('/admin/setup')
      .send(testAdmin)
      .end(function(err, res) {
        console.log(res.status);
        console.log(res.text);
        expect(res.status).to.equal(302);
        expect(res.text).to.match(/^Found/);
        done();
      });
  });

});

describe('*LOGIN*', function() {

  it('should not allow unauthenticated access', function(done) {
    request(app)
      .get('/user')
      .end(function(err, res) {
        if (err) throw err;
        expect(res.text).to.equal('not authorized');
        done();
      })
  });


  it('should accept credentials on /login', function(done) {
    agent
      .post('/login')
      .send({ username: testAdmin.username, password: testAdmin.password })
      .end(function(err, res) {
        if (err) throw err;
        expect(res.headers['set-cookie']).to.exist;
        expect(res.text).to.match(/^Found/);
        done();
      });
  });

  it('should retain session auth across requests', function(done) {
    agent
      .get('/user')
      .end(function(err, res) {
        if (err) throw err;
        // console.log("res keys: ", Object.keys(res))
        expect(res.body[0]).to.be.a('object');
        expect(res.body[0]).to.be.have.property('username');
        expect(res.request.cookies).to.match(/connect.sid/);
        done();
      });
  });

});
