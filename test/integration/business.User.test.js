const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, User } = require('../../models');

describe('business : User', () => {
    let authenticatedUser, authenticatedUserDBInst;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        authenticatedUserDBInst = await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W'
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get myself', () => {
        it('get', async () => {
            try {
                const res = await authenticatedUser.get('/users/me');
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.username).to.equal('test');
                expect(res.body.password).to.exist;
                expect(res.body.managedProjects).to.be.an('array');
                expect(res.body.participatedProjects).to.be.an('array');
            } catch (err) {
                throw err;
            }
        });
    });
});