require('../../main');
const config = require('../../config');
config.env = 'test';
const supertest = require('supertest');
const server = supertest.agent(config.base_url);
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

let testWine = { name: 'Cabernet sauvignon', year: 2013, country: 'France', type: 'red', description: 'The Sean Connery of red wines' };
const newWine = { name: 'Glühwein', year: 2017, country: 'Austria', type: 'red', 'description': 'Hofer Premium' };

describe('Wine REST-API', () => {
    before(function (done) {
        setTimeout(function () {
            done();
        }, 1000);
    });

    describe('/GET wines', () => {
        it('it should GET all the wines', (done) => {
            server
                .get('/wines')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('/POST wines', () => {
        describe('no POST --> INVALID input', () => {
            it('it should NOT POST a wine given INVALID input', (done) => {
                let wine = { name: 1, year: 'Schaltjahr', country: 123, type: 'blue' };
                server
                    .post('/wines/')
                    .send(wine)
                    .expect(400)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('error').eql('VALIDATION_ERROR');
                        res.body.validation.should.have.property('name').eql('INVALID');
                        res.body.validation.should.have.property('year').eql('INVALID');
                        res.body.validation.should.have.property('country').eql('INVALID');
                        res.body.validation.should.have.property('type').eql('INVALID');
                        done();
                    });
            });
        });
        describe('no POST --> MISSING input', () => {
            it('it should NOT POST a wine given MISSING input', (done) => {
                let wine = {};
                server
                    .post('/wines/')
                    .send(wine)
                    .expect(400)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('error').eql('VALIDATION_ERROR');
                        res.body.validation.should.have.property('name').eql('MISSING');
                        res.body.validation.should.have.property('year').eql('MISSING');
                        res.body.validation.should.have.property('country').eql('MISSING');
                        res.body.validation.should.have.property('type').eql('MISSING');
                        done();
                    });

            });
        });
        describe('/POST new wine', () => {
            it('it should POST a wine ', (done) => {
                server
                    .post('/wines')
                    .send(testWine)
                    .expect(200)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('id');
                        res.body.should.have.property('name').eql(testWine.name);
                        res.body.should.have.property('year').eql(testWine.year);
                        res.body.should.have.property('country').eql(testWine.country);
                        res.body.should.have.property('type').eql(testWine.type);
                        res.body.should.have.property('description').eql(testWine.description);
                        testWine = res.body;
                        done();
                    });
            });
        });
    });

    describe('/GET/:id wine', () => {
        describe('GET wine by id', () => {
            it('it should GET a wine by the given id', (done) => {
                server
                    .get('/wines/' + testWine.id)
                    .send(testWine)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('id').eql(testWine.id);
                        res.body.should.have.property('name').eql(testWine.name);
                        res.body.should.have.property('year').eql(testWine.year);
                        res.body.should.have.property('country').eql(testWine.country);
                        res.body.should.have.property('type').eql(testWine.type);
                        res.body.should.have.property('description').eql(testWine.description);
                        done();
                    });
            });
        });
        describe('wrong id NO wine', () => {
            it('it should NOT GET a wine by the given id', (done) => {
                server
                    .get('/wines/' + (testWine.id + 1))
                    .send(testWine)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('error').eql('UNKNOWN_OBJECT');
                        done();
                    });
            });
        });
    });

    describe('/PUT/:id wine', () => {
        describe('UPDATE with given id', () => {
            it('it should UPDATE a wine given the id', (done) => {
                server
                    .put('/wines/' + 1)
                    .send(newWine)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('id').eql(testWine.id);
                        res.body.should.have.property('name').eql(newWine.name);
                        res.body.should.have.property('year').eql(newWine.year);
                        res.body.should.have.property('country').eql(newWine.country);
                        res.body.should.have.property('type').eql(newWine.type);
                        res.body.should.have.property('description').eql(newWine.description);
                        Object.assign(testWine, res.body);
                        done();
                    });
            });
        });
    });

    describe('/DELETE/:id book', () => {
        describe('NO DELETION wrong id', () => {
            it('it should DELETE a book given the id', (done) => {
                server
                    .delete('/wines/' + testWine.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('success').eql(true);
                        done();
                    });
            });
        });
        describe('DELETE wine with given id', () => {
            it('it should not DELETE a wine given the id', (done) => {
                server
                    .delete('/wines/' + testWine.id)
                    .end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.have.property('error').eql('UNKNOWN_OBJECT');
                        done();
                    });
            });
        });
    });

});