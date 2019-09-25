const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Task, Project } = require('../../models');

describe('routes : Task', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await Project.create({ title: 'Create character', details: 'just copy from internet' });
        await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
    });

    describe('GET /tasks', () => {
        it.only('should return projects', async () => {
            await Task.create({ title: 'Buy PC2', details: 'from wallmart2', projectId: 1 });
            await chai
                .request(server)
                .get('/tasks')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body).to.have.length(2);
                    expect(res.body[0].title).to.equal('Buy PC');
                    expect(res.body[0].details).to.equal('from wallmart');
                    expect(res.body[0].projectId).to.equal(1);
                    expect(res.body[0].taskId).to.equal(null);
                    expect(res.body[1].title).to.equal('Buy PC2');
                    expect(res.body[1].details).to.equal('from wallmart2');
                    expect(res.body[1].projectId).to.equal(1);
                    expect(res.body[1].taskId).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('GET /tasks/:id', () => {
        it('should return task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .get('/tasks/2')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.title).to.equal('Buy PC');
                    expect(res.body.details).to.equal('from wallmart');
                    expect(res.body.projectId).to.equal(1);
                    expect(res.body.taskId).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return task', async () => {
            await chai
                .request(server)
                .get('/tasks/22')
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('task with id 22 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('POST /tasks', () => {
        it('should return a task', async () => {
            await chai
                .request(server)
                .post('/tasks')
                .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 1 })
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.id).to.equal(2);
                    expect(res.body.title).to.equal('Buy PC');
                    expect(res.body.details).to.equal('from wallmart');
                    expect(res.body.projectId).to.equal(1);
                    expect(res.body.taskId).to.equal(1);
                })
                .catch(err => {
                    throw err;
                });
        });
        it('task does not belong to the same project', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            await chai
                .request(server)
                .post('/tasks')
                .send({ title: 'Buy PC', details: 'from wallmart', projectId: 2, taskId: 1 })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('parent task with id 1 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a task 1', async () => {
            await chai
                .request(server)
                .post('/tasks')
                .send({ title: 'Buy PC', details: 'from wallmart', projectId: 20, taskId: 1 })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('parent project with id 20 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not return a task 2', async () => {
            await chai
                .request(server)
                .post('/tasks')
                .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 11 })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('parent task with id 11 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update task title', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .put('/tasks/2')
                .send({ title: 'Buy better PC' })
                .then(async res => {
                    const { id, title, details, projectId, taskId } = await Task.findByPk(2);
                    expect(res.status).to.equal(204);
                    expect(id).to.equal(2);
                    expect(title).to.equal('Buy better PC');
                    expect(details).to.equal('from wallmart');
                    expect(projectId).to.equal(1);
                    expect(taskId).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should update task details', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .put('/tasks/2')
                .send({ details: 'from target' })
                .then(async res => {
                    const { id, title, details, projectId, taskId } = await Task.findByPk(2);
                    expect(res.status).to.equal(204);
                    expect(id).to.equal(2);
                    expect(title).to.equal('Buy PC');
                    expect(details).to.equal('from target');
                    expect(projectId).to.equal(1);
                    expect(taskId).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a task 1', async () => {
            await chai
                .request(server)
                .put('/tasks/22')
                .send({ details: 'from target' })
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('task with id 22 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a task 2', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .put('/tasks/2')
                .send({ projectId: 5 })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('"projectId" is not allowed');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not update a task 3', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .put('/tasks/2')
                .send({ taskId: 5 })
                .then(res => {
                    expect(res.status).to.equal(400);
                    expect(res.type).to.equal('text/plain');
                    expect(res.text).to.equal('"taskId" is not allowed');
                })
                .catch(err => {
                    throw err;
                });
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            await chai
                .request(server)
                .delete('/tasks/2')
                .then(async res => {
                    const task = await Task.findByPk(2);
                    expect(res.status).to.equal(204);
                    expect(task).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should not delete a task', async () => {
            await chai
                .request(server)
                .delete('/tasks/2')
                .then(res => {
                    expect(res.status).to.equal(422);
                    expect(res.text).to.equal('task with id 2 does not exist');
                })
                .catch(err => {
                    throw err;
                });
        });
        it('should cacade delete a task and its sub-tasks', async () => {
            await Task.create({
                title: 'Create character',
                details: 'just copy from internet',
                projectId: 1,
                taskId: 1
            });
            await chai
                .request(server)
                .delete('/tasks/1')
                .then(async res => {
                    const task = await Task.findByPk(1);
                    const subTask = await Task.findByPk(2);
                    expect(res.status).to.equal(204);
                    expect(task).to.equal(null);
                    expect(subTask).to.equal(null);
                })
                .catch(err => {
                    throw err;
                });
        });
    });
});
