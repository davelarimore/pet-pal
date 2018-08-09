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
describe('Protected pets endpoint', function () {
    const email = 'exampleUser@test.biz';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    let createdClientId = '';

    const name = 'Test cat';
    const type = 'Cat';
    const breed = 'Test';
    const color = 'White';
    const food = 'Test food';

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

    describe('/api/pets', function () {
        it(`Should post a pet and associate it with the current user`, function () {
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
                            expect(res).to.have.status(201);
                            expect(res.body).to.be.an('object');
                            expect(res.body.email).to.deep.equal(email);
                            expect(res.body.firstName).to.deep.equal(firstName);
                            expect(res.body.lastName).to.deep.equal(lastName);
                            expect(res.body.pets[0].name).to.deep.equal(name);
                            expect(res.body.pets[0].type).to.deep.equal(type);
                            expect(res.body.pets[0].breed).to.deep.equal(breed);
                            expect(res.body.pets[0].color).to.deep.equal(color);
                            expect(res.body.pets[0].food).to.deep.equal(food);
                        });
                })
        });
    });
});