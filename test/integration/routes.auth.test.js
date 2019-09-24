const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { sequelize } = require('../../models');

describe('routes : Project', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    describe('POST /login', () => {
        it('should succefully login', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ title: 'Create character', details: 'just copy from internet' })
                .then(res => {
                    expect(res.status).to.equal(204);
                    expect(res.type).to.equal('application/json');
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
