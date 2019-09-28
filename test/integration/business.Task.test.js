const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Task, Project, User, ProjectParticipator } = require('../../models');

describe('business : Task', () => {
    let authenticatedUser;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            isSystemAdmin: false
        });
        await Project.create({
            title: 'Create character',
            details: 'just copy from internet',
            managerId: 1
        });
        await ProjectParticipator.create({ projectId: 1, participatorId: 1 });

        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({ username: 't', password: '$', isSystemAdmin: false });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });
            try {
                const res = await authenticatedUser.get('/tasks/1');
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('You are not part of that project!');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('Create a Task', () => {
        it('allow only self if you are in the project', async () => {
            await User.create({ username: 't', password: '$', isSystemAdmin: false });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            try {
                const res = await authenticatedUser
                    .post('/tasks')
                    .send({ title: 'Buy PC', details: 'from wallmart', projectId: 2 });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('You are not part of that project!');
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
        it('task does not belong to the same project', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
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
    });
    describe('Edit a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({ username: 't', password: '$', isSystemAdmin: false });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });
            try {
                const res = await authenticatedUser
                    .put('/tasks/1')
                    .send({ title: 'Buy better PC' });
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('You are not part of that project!');
            } catch (err) {
                throw err;
            }
        });
    });
    describe('Delete a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({ username: 't', password: '$', isSystemAdmin: false });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });
            try {
                const res = await authenticatedUser.delete('/tasks/1');
                expect(res.status).to.equal(400);
                expect(res.type).to.equal('text/plain');
                expect(res.text).to.equal('You are not part of that project!');
            } catch (err) {
                throw err;
            }
        });
    });
});
