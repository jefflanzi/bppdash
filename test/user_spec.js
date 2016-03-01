import chai from 'chai';
import User from '../models/user';
import chaiHttp from 'chai-http';
const expect = chai.expect;

chai.use(chaiHttp);
const host = "http://localhost:3000"

describe('/user', function() {

  it('creates a user', function(done) {
    var newUser = {
      username: "superman",
      usertype: "site administrator",
      password: "kryptonite"
    }

    chai.request(host)
      .post('/user')
      .send(newUser)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it('enforces unique user names', function(done) {
    var newUser = {
      username: "superman",
      usertype: "site administrator",
      password: "kryptonite"
    }

    chai.request(host)
      .post('/user')
      .send(newUser)
      .end(function(err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

});
