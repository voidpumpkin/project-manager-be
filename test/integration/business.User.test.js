const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, User } = require('../../models');

describe('business : User', () => {
    // eslint-disable-next-line no-unused-vars
    let authenticatedUser, authenticatedUserDBInst;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        authenticatedUserDBInst = await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            firstName: 'uncle',
            lastName: 'bob',
            email: 'uncle@bob.com',
            phoneNumber: '6664666'
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get myself', () => {
        it('get', async () => {
            const res = await authenticatedUser.get('/users/me');
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.data.attributes.username).to.equal('test');
            expect(res.body.data.attributes.password).to.exist;
            expect(res.body.relationships.managedProjects).to.be.an('array');
            expect(res.body.relationships.participatedProjects).to.be.an('array');
        });
    });
});
