const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize } = require('../../models');

describe('routes : auth', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    describe('POST /login', () => {
        it('should succefully login', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/login')
                    .send({ username: 'test', password: 'test' });
                expect(res.status).to.equal(204);
                expect(res).to.have.cookie('koa:sess');
                expect(res).to.have.cookie('koa:sess.sig');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('POST /logout', () => {
        it('should succefully logout', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/logout')
                    .send({ username: 'test', password: 'test' });
                expect(res.status).to.equal(204);
                expect(res).to.not.have.cookie('koa:sess');
                expect(res).to.not.have.cookie('koa:sess.sig');
            } catch (err) {
                throw err;
            }
        });
    });
});
