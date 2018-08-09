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
describe('Protected tasks endpoint', function () {
    const email = 'exampleUser@test.biz';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    const description = 'Test task';
    let createdClientId = '';

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
        );
    });

    afterEach(function () {
        return Users.remove({});
    });

    describe('/api/tasks', function () {
        it(`Should post task and associate it with current user`, function () {
            return login(email, password)
                .then((token) => {
                    return chai
                        .request(app)
                        .post('/api/tasks')
                        .set('authorization', `Bearer ${token}`)
                        .send({
                            clientId: createdClientId,
                            description
                        })
                        .then(res => {
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.deep.equal(email);
                            expect(res.body.firstName).to.deep.equal(firstName);
                            expect(res.body.lastName).to.deep.equal(lastName);
                            expect(res.body.tasks[0].description).to.deep.equal(description);
                        });
                })
        });
    });
});