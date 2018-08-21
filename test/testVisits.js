'use strict';
const { TEST_DATABASE_URL } = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');
const Visits = require('../models/visitsModel');

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
describe('Protected visits endpoint', function () {
    const email = 'exampleUser@test.biz';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    let createdClientId = '';
    let createdVisitId = '';

    const providerEmail = 'exampleProvider@test.biz';
    const providerPassword = 'examplePass';
    const providerFirstName = 'Example';
    const providerLastName = 'Provider';
    let createdProviderId = '';

    const startTime = '2001-08-30T14:30:00.000Z';
    const endTime = '2001-08-30T15:00:00.000Z';

    before(function () {
        return runServer(TEST_DATABASE_URL)
        .then(() => {
        return Users.hashPassword(providerPassword).then(password =>
            Users.create({
                email: providerEmail,
                password,
                firstName: providerFirstName,
                lastName: providerLastName
            })
                .then(user => {
                    createdProviderId = user.id;
                })
            )
        })
            .then(() => {
                return Users.hashPassword(password).then(password =>
                    Users.create({
                        email,
                        password,
                        firstName,
                        lastName,
                        providerId: createdProviderId
                    })
                        .then(user => {
                            createdClientId = user.id;
                        })
                )
            })
    });

    after(function () {
        return Users.remove({})
            .then(() => closeServer())
    });

    describe('/api/clients/visits', function () {
        it(`Should post a visit`, function () {
            return login(providerEmail, providerPassword)
                .then((token) => {
                    return chai
                        .request(app)
                        .post('/api/clients/visits')
                        .set('authorization', `Bearer ${token}`)
                        .send({
                            providerId: createdProviderId,
                            client: createdClientId,
                            startTime,
                            endTime
                        })
                        .then(res => {
                            createdVisitId = res.body.visits[0]._id;
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.visits[0].client._id).to.deep.equal(createdClientId);
                            expect(res.body.visits[0].providerId).to.deep.equal(createdProviderId);
                            expect(res.body.visits[0].startTime).to.deep.equal(startTime);
                            expect(res.body.visits[0].endTime).to.deep.equal(endTime);
                        });
                })
        });
        it(`Should prevent unauthorized user from posting a visit`, function () {
            return login(providerEmail, providerPassword)
                .then((token) => {
                    return chai
                        .request(app)
                        .post('/api/clients/visits')
                        .set('authorization', `Bearer ${token}`)
                        .send({
                            providerId: '12345',
                            client: '12345',
                            startTime,
                            endTime
                        })
                        .then(res => {
                            expect(res).to.have.status(403);
                        });
                })
        });
        it(`Should delete visit`, function () {
            return login(email, password)
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/clients/visits/${createdVisitId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res).to.have.status(204);
                            })
                    );
                })
        });
        it(`Should prevent unauthorized user from deleting visit`, function () {
            return login(email, 'wrongPassword')
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/clients/visits/${createdVisitId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res).to.have.status(401);
                            })
                    );
                })
        });
    });
});