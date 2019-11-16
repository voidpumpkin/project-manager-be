const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, User } = require('../../models');

describe('routes : auth', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    describe('POST /login', () => {
        it('should succefully login', async () => {
            await User.create({
                username: 'test',
                password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await chai
                .request(server)
                .post('/login')
                .send({ username: 'test', password: 'test' });
            expect(res.status).to.equal(204);
            expect(res).to.have.cookie('koa:sess');
            expect(res).to.have.cookie('koa:sess.sig');
        });
    });

    describe('POST /logout', () => {
        it('should succefully logout', async () => {
            const res = await chai
                .request(server)
                .post('/logout')
                .send({ username: 'test', password: 'test' });
            expect(res.status).to.equal(204);
            expect(res).to.not.have.cookie('koa:sess');
            expect(res).to.not.have.cookie('koa:sess.sig');
        });
    });
});
