const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { sequelize, Project } = require('../../models');

describe('routes : Project', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    describe('GET /projects/:id', () => {
        it('should return project', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            chai.request(server)
                .get('/projects/1')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.title).to.equal('Create character');
                    expect(res.body.details).to.equal('just copy from internet');
                });
        });
        //TODO: Project does not exist 400
    });
    describe('POST /projects', () => {
        it('should return a project', async () => {
            chai.request(server)
                .post('/projects')
                .send({ title: 'Create character', details: 'just copy from internet' })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.title).to.equal('Create character');
                    expect(res.body.details).to.equal('just copy from internet');
                });
        });
        //TODO: body not null
        //TODO: title not null
        //TODO: details not null
        //TODO: projectId not null
        //TODO: should not update a project creation date
        //TODO: should not update a project modification date
    });
    describe('PUT /projects/:id', () => {
        it('should update a project title', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .put('/projects/1')
                .send({ title: 'Draw character' })
                .then(async res => {
                    const { id, title, details } = await Project.findByPk(1);
                    expect(res.status).to.equal(204);
                    expect(id).to.equal(1);
                    expect(title).to.equal('Draw character');
                    expect(details).to.equal('just copy from internet');
                })
                .catch(function(err) {
                    throw err;
                });
        });
        it('should update a project details', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .put('/projects/1')
                .send({ details: 'just copy from pinterest' })
                .then(async res => {
                    const { id, title, details } = await Project.findByPk(1);
                    expect(res.status).to.equal(204);
                    expect(id).to.equal(1);
                    expect(title).to.equal('Create character');
                    expect(details).to.equal('just copy from pinterest');
                })
                .catch(function(err) {
                    throw err;
                });
        });
        //TODO: Project does not exist 400
        //TODO: body not null 400
        //TODO: title not null 400
        //TODO: details not null 400
        //TODO: projectId dont allow 400
        //TODO: id dont allow
        //TODO: creation date dont allow 400
        //TODO: modification date dont allow 400
    });
    describe('DELETE /projects/:id', () => {
        it('should delete a project', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .delete('/projects/1')
                .then(async res => {
                    const project = await Project.findByPk(1);
                    expect(res.status).to.equal(204);
                    expect(project).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
        //TODO: negative flow delete not existing thing
        //TODO: should delete all tasks aswell
    });
});
