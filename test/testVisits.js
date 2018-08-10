'use strict';
global.DATABASE_URL = 'mongodb://localhost:27017/test-pet-pal';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');

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

    const providerEmail = 'exampleProvider@test.biz';
    const providerPassword = 'examplePass';
    const providerFirstName = 'Example';
    const providerLastName = 'Provider';
    let createdProviderId = '';

    const startTime = '2001-08-30T14:30:00.000Z';
    const endTime = '2001-08-30T15:00:00.000Z';
    const recurrence = 'Daily';

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
                .then(user => {
                    createdClientId = user.id;
                })
        )
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
            );
        })
    });

    afterEach(function () {
        return Users.remove({});
    });

    describe('/api/clients/visits', function () {
        it(`Should post a visit and associate it with the client and their provider`, function () {
            return login(providerEmail, providerPassword)
                .then((token) => {
                    return chai
                        .request(app)
                        .post('/api/clients/visits')
                        .set('authorization', `Bearer ${token}`)
                        .send({
                            providerId: createdProviderId,
                            clientId: createdClientId,
                            startTime,
                            endTime,
                            recurrence
                        })
                        .then(res => {
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.deep.equal(providerEmail);
                            expect(res.body.visits[0].clientId).to.deep.equal(createdClientId);
                            expect(res.body.visits[0].providerId).to.deep.equal(createdProviderId);
                            expect(res.body.visits[0].startTime).to.deep.equal(startTime);
                            expect(res.body.visits[0].endTime).to.deep.equal(endTime);
                            expect(res.body.visits[0].recurrence).to.deep.equal(recurrence);
                        });
                })
        });
    });
});