const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { sequelize, Project, Task } = require('../../models');

describe('routes : Project', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    describe('GET /projects/:id', () => {
        it('should return project', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .get('/projects/1')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.title).to.equal('Create character');
                    expect(res.body.details).to.equal('just copy from internet');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return project', async () => {
            await chai
                .request(server)
                .get('/projects/1')
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('project with id 1 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
    });
    describe('POST /projects', () => {
        it('should return a project', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ title: 'Create character', details: 'just copy from internet' })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.id).to.equal(1);
                    expect(res.body.title).to.equal('Create character');
                    expect(res.body.details).to.equal('just copy from internet');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 1', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({})
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('child "title" fails because ["title" is required]');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 2', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ title: null })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal(
                        'child "title" fails because ["title" must be a string]'
                    );
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 3', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ title: '' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal(
                        'child "title" fails because ["title" is not allowed to be empty]'
                    );
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 4', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ title: 'a', details: null })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal(
                        'child "details" fails because ["details" must be a string]'
                    );
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 5', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ projectId: 1, title: 'a', details: '' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('"projectId" is not allowed');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 6', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ createdAt: new Date(), title: 'a', details: '' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('"createdAt" is not allowed');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a project 7', async () => {
            await chai
                .request(server)
                .post('/projects')
                .send({ updatedAt: new Date(), title: 'a', details: '' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('"updatedAt" is not allowed');
                })
                .catch(err => {
                    throw err;
                });
        });
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
                .catch(err => {
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
                .catch(err => {
                    throw err;
                });
        });
        it('should update a project nothing', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .put('/projects/1')
                .send({})
                .then(async res => {
                    const { title, details } = await Project.findByPk(1);
                    expect(res.status).to.equal(204);
                    expect(title).to.equal('Create character');
                    expect(details).to.equal('just copy from internet');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a project 1', async () => {
            await chai
                .request(server)
                .put('/projects/1')
                .send({ details: 'just copy from pinterest' })
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('project with id 1 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a project 2', async () => {
            await chai
                .request(server)
                .put('/projects/1')
                .send({ details: 'just copy from pinterest' })
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('project with id 1 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a project 3', async () => {
            await chai
                .request(server)
                .put('/projects/1')
                .send({ title: null })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal(
                        'child "title" fails because ["title" must be a string]'
                    );
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a project 4', async () => {
            await chai
                .request(server)
                .put('/projects/1')
                .send({ title: '' })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal(
                        'child "title" fails because ["title" is not allowed to be empty]'
                    );
                })
                .catch(err => {
                    throw err;
                });
        });
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
        it('should not delete a project', async () => {
            await chai
                .request(server)
                .delete('/projects/1')
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.text).to.equal('project with id 1 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should cacade delete a project and its tasks', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await Task.create({ title: 'C', details: '', projectId: 1 });
            await chai
                .request(server)
                .delete('/projects/1')
                .then(async res => {
                    const task = await Task.findByPk(1);
                    const project = await Project.findByPk(1);
                    expect(res.status).to.equal(204);
                    expect(project).to.equal(null);
                    expect(task).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
