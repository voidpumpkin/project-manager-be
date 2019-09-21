const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { Project } = require('../../models');

describe('routes : index', () => {
    describe('GET /tasks/:id', () => {
        it('should return project', async () => {
            const { id, title, details } = await Project.create({
                title: 'title',
                details: 'details'
            });
            chai.request(server)
                .get(`/projects/${id}`)
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.eql(200);
                    expect(res.type).to.eql('application/json');
                    expect(res.body.title).to.equal(title);
                    expect(res.body.details).to.equal(details);
                });
        });
    });
});
