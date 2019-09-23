const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');

describe('routes : index', () => {
    describe('GET /', () => {
        it('should return text', async () => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.eql(200);
                    expect(res.type).to.eql('text/plain');
                    expect(res.text).to.equal('You are using the Project Manager Back-end!');
                });
        });
    });
});
