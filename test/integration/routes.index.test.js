const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');

describe('routes : index', () => {
    describe('GET /', () => {
        it('should return text', async () => {
            const res = await chai.request(server).get('/');
            expect(res.status).to.eql(200);
            expect(res.type).to.eql('text/plain');
            expect(res.text).to.equal('You are using the Project Manager Back-end!');
        });
    });
});
