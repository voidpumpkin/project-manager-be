const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Task, Project, User } = require('../../models');

describe('routes : Task', () => {
    let authenticatedUser;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await Project.create({ title: 'Create character', details: 'just copy from internet' });
        await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });

        await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            isSystemAdmin: true
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('GET /tasks', () => {
        it('should return projects', async () => {
            await Task.create({ title: 'Buy PC2', details: 'from wallmart2', projectId: 1 });
            try {
                const res = await authenticatedUser.get('/tasks');
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
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            try {
                const res = await chai.request(server).get('/tasks');
                expect(res.status).to.equal(401);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('GET /tasks/:id', () => {
        it('should return task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser.get('/tasks/2');
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.title).to.equal('Buy PC');
                expect(res.body.details).to.equal('from wallmart');
                expect(res.body.projectId).to.equal(1);
                expect(res.body.taskId).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('Task with does not exist', async () => {
            try {
                const res = await authenticatedUser.get('/tasks/22');
                expect(res.status).to.equal(422);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Task with id 22 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await chai.request(server).get('/tasks/2');
                expect(res.status).to.equal(401);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('POST /tasks', () => {
        it('should return a task', async () => {
            try {
                const res = await authenticatedUser
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 1 });
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.id).to.equal(2);
                expect(res.body.title).to.equal('Buy PC');
                expect(res.body.details).to.equal('from wallmart');
                expect(res.body.projectId).to.equal(1);
                expect(res.body.taskId).to.equal(1);
            } catch (err) {
                throw err;
            }
        });
        it('task does not belong to the same project', async () => {
            await Project.create({ title: 'Create character', details: 'just copy from internet' });
            try {
                const res = await authenticatedUser
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 2, taskId: 1 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('parent task with id 1 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('parent project does not exist', async () => {
            try {
                const res = await authenticatedUser
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 20, taskId: 1 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('parent project with id 20 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('parent task does not exist', async () => {
            try {
                const res = await authenticatedUser
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 11 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('parent task with id 11 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 1, taskId: 1 });
                expect(res.status).to.equal(401);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('PUT /tasks/:id', () => {
        it('should update task title', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser
                    .put('/tasks/2')
                    .send({ title: 'Buy better PC' });
                const { id, title, details, projectId, taskId } = await Task.findByPk(2);
                expect(res.status).to.equal(204);
                expect(id).to.equal(2);
                expect(title).to.equal('Buy better PC');
                expect(details).to.equal('from wallmart');
                expect(projectId).to.equal(1);
                expect(taskId).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('should update task details', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser
                    .put('/tasks/2')
                    .send({ details: 'from target' });
                const { id, title, details, projectId, taskId } = await Task.findByPk(2);
                expect(res.status).to.equal(204);
                expect(id).to.equal(2);
                expect(title).to.equal('Buy PC');
                expect(details).to.equal('from target');
                expect(projectId).to.equal(1);
                expect(taskId).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('Task with does not exist', async () => {
            try {
                const res = await authenticatedUser
                    .put('/tasks/22')
                    .send({ details: 'from target' });
                expect(res.status).to.equal(422);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Task with id 22 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('"projectId" is not allowed', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser.put('/tasks/2').send({ projectId: 5 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('"projectId" is not allowed');
            } catch (err) {
                throw err;
            }
        });
        it('"taskId" is not allowed', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser.put('/tasks/2').send({ taskId: 5 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('"taskId" is not allowed');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await chai
                    .request(server)
                    .put('/tasks/2')
                    .send({ title: 'Buy better PC' });
                expect(res.status).to.equal(401);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            await Task.create({ title: 'Buy PC', details: 'from wallmart', projectId: 1 });
            try {
                const res = await authenticatedUser.delete('/tasks/2');
                const task = await Task.findByPk(2);
                expect(res.status).to.equal(204);
                expect(task).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('Task with does not exist', async () => {
            try {
                const res = await authenticatedUser.delete('/tasks/2');
                expect(res.status).to.equal(422);
                expect(res.text).to.equal('Task with id 2 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('should cacade delete a task and its sub-tasks', async () => {
            await Task.create({
                title: 'Create character',
                details: 'just copy from internet',
                projectId: 1,
                taskId: 1
            });
            try {
                const res = await authenticatedUser.delete('/tasks/1');
                const task = await Task.findByPk(1);
                const subTask = await Task.findByPk(2);
                expect(res.status).to.equal(204);
                expect(task).to.equal(null);
                expect(subTask).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            try {
                const res = await chai.request(server).delete('/tasks/2');
                expect(res.status).to.equal(401);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });
});
