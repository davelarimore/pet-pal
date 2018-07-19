const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users', function() {
  // Before our tests run, we activate the server.
  before(function() {
    return runServer();
  });

  // Close server after these tests run in case
  after(function() {
    return closeServer();
  });
  // `chai.request.get` is an asynchronous operation. When
  // using Mocha with async operations, we need to either
  // return an ES6 promise or else pass a `done` callback to the
  // test that we call at the end. We prefer the first approach, so
  // we just return the chained `chai.request.get` object.
  it('Should return html', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        //expect(res.body).to.be.a('array');
        //expect(res.body.length).to.be.above(0);
        //res.body.forEach(function(item) {
        //  expect(item).to.be.a('object');
        //  expect(item).to.have.all.keys(
        //    'id', 'firstName', 'lastName', 'birthYear');
        //});
      });
  });
});