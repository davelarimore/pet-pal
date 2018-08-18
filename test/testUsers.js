'use strict';
const { TEST_DATABASE_URL } = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');

const expect = chai.expect;

chai.use(chaiHttp);

//Helper
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
    let createdUserId = '';

    before(function () {
        return runServer(TEST_DATABASE_URL)
        .then(() => {
            return Users.hashPassword(password).then(password =>
                Users.create({
                    email,
                    password,
                    firstName,
                    lastName,
                })
                    .then(user => {
                        createdUserId = user.id;
                    })
            );

        })
    });

    after(function () {
        return Users.remove({})
            .then(() => closeServer())
    });

    describe('/api/users', function () {
        it('Should reject requests with no credentials', function () {
            return chai
                .request(app)
                .get('/api/users')
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
                .get('/api/users')
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
                    .get('/api/users')
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
        it(`Should update user`, function () {
            const updateData = {
                _id: createdUserId,
                firstName: 'foo',
                lastName: 'bar',
                phone: 'fizz',
                addressString: 'buzz'
            };
            return login(email, password)
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .put(`/api/users`)
                            .set('authorization', `Bearer ${token}`)
                            .send(updateData)
                            .then((res) => {
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a("object");
                                expect(res.body.lastName).to.deep.equal(updateData.lastName);
                            })
                    );
                })
        });
        it(`Should prevent unauthorized user from updating user`, function () {
            const updateData = {
                _id: createdUserId,
                firstName: 'foo',
                lastName: 'bar',
                phone: 'fizz',
                addressString: 'buzz'
            };
            return login(email, 'wrongPassword')
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .put(`/api/users`)
                            .set('authorization', `Bearer ${token}`)
                            .send(updateData)
                            .then((res) => {
                                expect(res).to.have.status(401);
                            })
                    );
                })
        });
        it(`Should prevent unauthorized user from deleting user`, function () {
            return login(email, 'wrongPassword')
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/users/${createdUserId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then((res) => {
                                expect(res).to.have.status(401);
                            })
                    );
                })
        });
    });
});