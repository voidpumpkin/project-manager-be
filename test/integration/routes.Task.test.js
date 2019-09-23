const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../index');
const { sequelize, Task, Project } = require('../../models');

describe('routes : Task', () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await Project.create({ title: 'Create character', details: 'just copy from internet' });
        await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
    });

    describe('GET /tasks/:id', () => {
        it('should return task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            chai.request(server)
                .get('/tasks/2')
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.title).to.equal('Buy PC');
                    expect(res.body.details).to.equal('from wallmart');
                    expect(res.body.projectId).to.equal(1);
                    expect(res.body.taskId).to.equal(null);
                });
        });
        //TODO: Task does not exist 400
    });
    describe('POST /tasks', () => {
        it('should return a task', async () => {
            chai.request(server)
                .post('/tasks')
                .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 1 })
                .end((err, res) => {
                    expect(err).to.not.exist;
                    expect(res.status).to.equal(200);
                    expect(res.type).to.equal('application/json');
                    expect(res.body.id).to.equal(2);
                    expect(res.body.title).to.equal('Buy PC');
                    expect(res.body.details).to.equal('from wallmart');
                    expect(res.body.projectId).to.equal(1);
                    expect(res.body.taskId).to.equal(1);
                    //FIXME:
                    // expect(res.body.taskId).to.equal(null);
                });
        });
        //TODO: body not null
        //TODO: title not null
        //TODO: details not null
        //TODO: projectId not null
        //TODO: should not update a project creation date
        //TODO: should not update a project modification date
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
                .catch(function(err) {
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
                .catch(function(err) {
                    throw err;
                });
        });
        //TODO: Task does not exist 400
        //TODO: body not null 400
        //TODO: title not null 400
        //TODO: details not null 400
        //TODO: projectId dont allow 400
        //TODO: taskId dont allow 400
        //TODO: id dont allow
        //TODO: creation date dont allow 400
        //TODO: modification date dont allow 400
    });
    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            chai.request(server)
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
        //TODO: negative flow delete not existing thing
        //TODO: should delete all tasks aswell
    });
});
