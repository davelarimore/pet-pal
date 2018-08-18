'use strict';
const { TEST_DATABASE_URL } = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const Users = require('../models/usersModel');
const Pets = require('../models/petsModel');

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
describe('Protected pets endpoint', function () {
    const email = 'exampleUser@test.biz';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    let createdClientId = '';
    let createdPetId = '';

    const name = 'Test cat';
    const type = 'Cat';
    const breed = 'Test';
    const color = 'White';
    const food = 'Test food';

    before(function () {
        return runServer(TEST_DATABASE_URL)
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

    describe('/api/pets', function () {
        it(`Should post a pet`, function () {
            return login(email, password)
                .then((token) => {
                    return chai
                        .request(app)
                        .post('/api/pets')
                        .set('authorization', `Bearer ${token}`)
                        .send({
                            clientId: createdClientId,
                            name,
                            type,
                            breed,
                            color,
                            food
                        })
                        .then(res => {
                            createdPetId = res.body._id;
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.clientId).to.deep.equal(createdClientId);
                            expect(res.body.name).to.deep.equal(name);
                            expect(res.body.type).to.deep.equal(type);
                            expect(res.body.breed).to.deep.equal(breed);
                            expect(res.body.color).to.deep.equal(color);
                            expect(res.body.food).to.deep.equal(food);
                        });
                })
        });
        it(`Should update pet`, function () {
            const updateData = {
                _id: createdPetId,
                name: 'foo',
                type: 'bar',
                breed: 'fizz',
                color: 'buzz',
                food: 'test'
            };
            return login(email, password)
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .put(`/api/pets/${createdPetId}`)
                            .set('authorization', `Bearer ${token}`)
                            .send(updateData)
                            .then((res) => {
                                console.log(res.body);
                                expect(res).to.have.status(200);
                                expect(res.body).to.be.a("object");
                                expect(res.body.name).to.deep.equal(updateData.name);
                            })
                    );
                })
        });
        it(`Should prevent unauthorized user from updating pet`, function () {
            const updateData = {
                _id: createdPetId,
                name: 'foo',
                type: 'bar',
                breed: 'fizz',
                color: 'buzz',
                food: 'test'
            };
            return login(email, 'wrongPassword')
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .put(`/api/pets/${createdPetId}`)
                            .set('authorization', `Bearer ${token}`)
                            .send(updateData)
                            .then((res) => {
                                console.log(res.body);
                                expect(res).to.have.status(401);
                            })
                    );
                })
        });
        it(`Should delete pet`, function () {
            return login(email, password)
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/pets/${createdPetId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res).to.have.status(204);
                            })
                    );
                })
        });
        it(`Should prevent unauthorized user from deleting pet`, function () {
            return login(email, 'wrongPassword')
                .then((token) => {
                    return (
                        chai
                            .request(app)
                            .delete(`/api/pets/${createdPetId}`)
                            .set('authorization', `Bearer ${token}`)
                            .then(function (res) {
                                expect(res).to.have.status(401);
                            })
                    );
                })
        });
    });
});