const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { sequelize, User } = require('../../models');

describe('routes : User', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });
    describe('GET /users/me', () => {
        it('should return user', async () => {
            await User.create({ email: 'bob', password: 'jones' });
            await chai
                .request(server)
                .get('/users/me')
                .set('Authorization', 'Basic Ym9iOmpvbmVz')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.email).to.equal('bob');
                    expect(res.body.password).to.equal('jones');
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('POST /users', () => {
        it('should create and return a user', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ email: 'bob', password: 'jones' })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.email).to.equal('bob');
                    expect(res.body.password).to.equal('jones');
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
