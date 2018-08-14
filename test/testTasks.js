'use strict';
global.DATABASE_URL = 'mongodb://localhost:27017/test-pet-pal';
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');
const Tasks = require('../models/tasksModel');

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
    let createdTaskId = '';

    before(function () {
        return runServer()
        .then(() => {
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
        })
    });

    after(function () {
        return Users.remove({})
            .then(() => closeServer())
    });

    describe('/api/tasks', function () {
        it(`Should post task`, function () {
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
                            createdTaskId = res.body._id;
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.clientId).to.deep.equal(createdClientId);
                            expect(res.body.description).to.deep.equal(description);
                        });
                })
        });
        it(`Should delete task`, function () {
            return login(email, password)
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/tasks/${createdTaskId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res).to.have.status(204);
                            })
                    );
                })
        });
    });
});