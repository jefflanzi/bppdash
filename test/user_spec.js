
process.env.NODE_ENV = 'test';
var chai = require('chai');
var expect = chai.expect;
var request = require('supertest');
var app = require('../app');
var mongoose = require('mongoose');
var User = require('../models/user');


describe('*USER ROUTES*', function() {
  this.timeout(5 * 1000);
  // Configure an agent object
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

    function cleanDB() {
      User.remove({}, function(err) {
        if (err) throw err;
        console.log('+User collection removed');

        User.register(
          new User({
            username: testAdmin.username,
            usertype: testAdmin.usertype
          }),
          testAdmin.password,
          function(err, user) {
            if (err) throw err;
            console.log('+Test Admin Registered');
            done();
          }
        );
      });
    }

    if(mongoose.connection.readyState === 1) {
      cleanDB();
    } else {
      mongoose.connection.once('open', cleanDB);
    }

  });

  describe('*AUTHENTICATION*', function() {

    it('requires authentication', function(done) {
      agent
        .get('/user')
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.text).to.equal('not authorized');
        });
      agent
        .post('/user')
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.text).to.equal('not authorized');
          done();
        });
    });

    it('returns a session cookie and redirects on login', function(done) {
      agent
        .post('/login')
        .send({ username: testAdmin.username, password: testAdmin.password})
        .end(function(err, res) {
          expect(res.headers['set-cookie']).to.exist;
          expect(res.text).to.match(/^Found/);
          done();
        });
    });

  });

  describe('*LIST USERS*', function() {
    it('gets a list of users', function(done) {
      agent
        .get('/user')
        .end(function(err, res) {
          expect(res.body[0]).to.have.ownProperty('_id', 'username', 'usertype');
          expect(res.body[0].username).to.equal('testadmin');
          done();
        });
    });
  });

  describe('*CREATE USER*', function() {

    it('creates a user', function(done) {
      agent
        .post('/user')
        .send(newUser)
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.be.a('object');
          expect(res.body.username).to.equal(newUser.username);
          expect(res.body.usertype).to.equal(newUser.usertype);
          done();
        });
    });

    it('does not allow duplicate usernames', function(done) {
      agent
        .post('/user')
        .send(newUser)
        .end(function(err, res) {
          expect(res.body.name).to.equal('UserExistsError');
          done();
        });
    });

  });

  describe('*DELETE USER*', function() {

    it('deletes a user by id', function(done) {

      User.findOne({username: newUser.username}, function(err, user) {
        agent
          .post('/user/' + user._id)
          .end(function(err, res) {
            expect(res.text).to.equal('deleted: ' + newUser.username);
            done();
          });
      });

    })
  })

});
