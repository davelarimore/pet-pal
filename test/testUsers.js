'use strict';
global.DATABASE_URL = 'mongodb://localhost:27017/test-pet-pal';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

//Helpers
function login(email, password) {
    return chai
        .request(app)
        .post('/auth/login')
        .send({ email, password })
        .then((res) => {
            return res.body.authToken;
        })
}

//Tests
describe('Protected users endpoint', function () {
    const email = 'exampleUser@test.biz';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return Users.hashPassword(password).then(password =>
            Users.create({
                email,
                password,
                firstName,
                lastName
            })
        );
    });

    afterEach(function () {
        return Users.remove({});
    });

    describe('/api/users/me', function () {
        it('Should reject requests with no credentials', function () {
            return chai
                .request(app)
                .get('/api/users/me')
                .then((res) => {
                    expect(res).to.have.status(401);
                })
            });

        it('Should reject requests with an invalid token', function () {
            const token = jwt.sign(
                {
                    email,
                    firstName,
                    lastName
                },
                'wrongSecret',
                {
                    algorithm: 'HS256',
                    expiresIn: '7d'
                }
            );
            return chai
                .request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`)
                .then((res) => {
                    expect(res).to.have.status(401);
                })
            });
        it(`Should return current user's data`, function () {
            return login(email, password)
            .then((token) => {
                return chai
                    .request(app)
                    .get('/api/users/me')
                    .set('authorization', `Bearer ${token}`)
                    .then(res => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body.email).to.deep.equal(email);
                        expect(res.body.firstName).to.deep.equal(firstName);
                        expect(res.body.lastName).to.deep.equal(lastName);
                    });
            })
        });
    });
});

////////////////////////////////
//AUTHENTICATED PROVIDERS ONLY
////////////////////////////////

// // GET: all my clients, authenticated providers only
// router.get('/users/clients', usersController.usersGetClientList);

// // GET one of my clients by ID, accessible by authenticated provider only
// router.get('/users/clients/:id', usersController.usersGetClient);

// // GET one of my clients by lastName, accessible by authenticated provider only
// router.get('/users/clients/:lastName', usersController.usersGetClientByName);

// // POST new client accessible by authenticated provider only
// router.post('/users/clients', usersController.usersPostClient);

// //PUT MY CLIENT: update client of an authenticated provider 
// router.put('/users/clients/:id', usersController.usersPutClient);

// ////////////////////////////////
// // ALL AUTHENTICATED USERS
// ////////////////////////////////

// // GET users/me: - get my client object only, accessible by any authenticated user
// router.get('/users/me', usersController.usersGetMe);

// //POST: create a user via the signup forms
// router.post('/users', jsonParser, usersController.usersPost);

// //PUT ME: update authenticated user (update me)
// router.put('/users/me', usersController.usersPutMe);
