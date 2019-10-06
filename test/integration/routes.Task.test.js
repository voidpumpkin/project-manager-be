const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Task, Project, User, ProjectParticipator } = require('../../models');

describe('routes : Task', () => {
    let authenticatedUser;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            firstName: 'uncle',
            lastName: 'bob',
            email: 'uncle@bob.com',
            phoneNumber: '6664666'
        });
        await Project.create({
            title: 'Create character',
            details: 'just copy from internet',
            managerId: 1
        });
        await ProjectParticipator.create({ participatorId: 1, projectId: 1 });
        await Task.create({
            title: 'Buy PC',
            details: 'from wallmart',
            isDone: false,
            projectId: 1
        });

        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('GET /tasks/:id', () => {
        it('should return task', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await authenticatedUser.get('/tasks/2');
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.data.attributes.title).to.equal('Buy PC');
                expect(res.body.data.attributes.details).to.equal('from wallmart');
                expect(res.body.relationships.project.id).to.equal(1);
                expect(res.body.relationships.task).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('Task with does not exist', async () => {
            try {
                const res = await authenticatedUser.get('/tasks/22');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('Task with id 22 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await chai.request(server).get('/tasks/2');
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('POST /tasks', () => {
        it('should return a task', async () => {
            try {
                const res = await authenticatedUser.post('/tasks').send({
                    data: {
                        type: 'tasks',
                        attributes: { title: 'Buy PC', details: 'from wallmart' }
                    },
                    relationships: {
                        project: { type: 'projects', id: 1 },
                        task: { type: 'tasks', id: 1 }
                    }
                });
                expect(res.status).to.equal(201);
                expect(res.type).to.equal('application/json');
                expect(res.body.data.id).to.equal(2);
                expect(res.body.data.attributes.title).to.equal('Buy PC');
                expect(res.body.data.attributes.details).to.equal('from wallmart');
                expect(res.body.relationships.project.id).to.equal(1);
                expect(res.body.relationships.task.id).to.equal(1);
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/tasks')
                    .send({
                        data: {
                            type: 'tasks',
                            attributes: {
                                title: 'Buy PC',
                                details: 'from wallmart'
                            }
                        },
                        relationships: {
                            project: {
                                type: 'projects',
                                id: 1
                            },
                            task: { type: 'tasks', id: 1 }
                        }
                    });
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('PATCH /tasks/:id', () => {
        it('should update task title', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await authenticatedUser
                    .patch('/tasks/2')
                    .send({ data: { type: 'tasks', attributes: { title: 'Buy better PC' } } });
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
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await authenticatedUser
                    .patch('/tasks/2')
                    .send({ data: { type: 'tasks', attributes: { details: 'from target' } } });
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
                    .patch('/tasks/22')
                    .send({ data: { type: 'tasks', attributes: { details: 'from target' } } });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('Task with id 22 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('"projectId" is not allowed', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await authenticatedUser
                    .patch('/tasks/2')
                    .send({ relationships: { project: { type: 'projects', id: 5 } } });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'child "relationships" fails because ["project" is not allowed]'
                );
            } catch (err) {
                throw err;
            }
        });
        it('"taskId" is not allowed', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await authenticatedUser
                    .patch('/tasks/2')
                    .send({ relationships: { task: { type: 'tasks', id: 5 } } });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'child "relationships" fails because ["task" is not allowed]'
                );
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
            try {
                const res = await chai
                    .request(server)
                    .patch('/tasks/2')
                    .send({ data: { type: 'tasks', attributes: { title: 'Buy better PC' } } });
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('DELETE /tasks/:id', () => {
        it('should delete a task', async () => {
            await Task.create({
                title: 'Buy PC',
                details: 'from wallmart',
                isDone: false,
                projectId: 1
            });
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
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('Task with id 2 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('should cacade delete a task and its sub-tasks', async () => {
            await Task.create({
                title: 'Create character',
                details: 'just copy from internet',
                isDone: false,
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
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });
});
