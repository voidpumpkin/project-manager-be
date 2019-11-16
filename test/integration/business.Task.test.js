const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Task, Project, User } = require('../../models');

describe('business : Task', () => {
    let authenticatedUser, authenticatedUserDBInst;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        authenticatedUserDBInst = await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            firstName: 'uncle',
            lastName: 'bob',
            email: 'uncle@bob.com',
            phoneNumber: '6664666'
        });
        const project = await Project.create({
            title: 'Create character',
            details: 'just copy from internet',
            managerId: 1
        });
        await project.addParticipator(authenticatedUserDBInst);

        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });

            const res = await authenticatedUser.get('/tasks/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not part of that project!');
        });
    });

    describe('Create a Task', () => {
        it('allow only self as manager if you are in the project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({ title: 'C', details: '', managerId: 2 });

            const res = await authenticatedUser.post('/tasks').send({
                data: {
                    type: 'tasks',
                    attributes: { title: 'Buy PC', details: 'from wallmart' }
                },
                relationships: { project: { type: 'projects', id: 2 } }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not part of that project!');
        });
        it('allow asignee only if it participates in project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.post('/tasks').send({
                data: {
                    type: 'tasks',
                    attributes: {
                        title: 'Buy PC',
                        details: 'from wallmart'
                    }
                },
                relationships: {
                    project: { type: 'projects', id: 1 },
                    assignee: { type: 'users', id: 2 }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('Asignee must be a project participator');
        });
        it('parent project does not exist', async () => {
            const res = await authenticatedUser.post('/tasks').send({
                data: {
                    type: 'tasks',
                    attributes: { title: 'Buy PC', details: 'from wallmart' }
                },
                relationships: {
                    project: { type: 'projects', id: 20 },
                    task: { type: 'tasks', id: 1 }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('parent project with id 20 does not exist');
        });
        it('parent task does not exist', async () => {
            const res = await authenticatedUser.post('/tasks').send({
                data: {
                    type: 'tasks',
                    attributes: { title: 'Buy PC', details: 'from wallmart' }
                },
                relationships: {
                    project: { type: 'projects', id: 1 },
                    task: { type: 'tasks', id: 11 }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('parent task with id 11 does not exist');
        });
        it('task does not belong to the same project', async () => {
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await project.addParticipator(authenticatedUserDBInst);

            const res = await authenticatedUser.post('/tasks').send({
                data: {
                    type: 'tasks',
                    attributes: { title: 'Buy PC', details: 'from wallmart' }
                },
                relationships: {
                    project: { type: 'projects', id: 2 },
                    task: { type: 'tasks', id: 1 }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('parent task with id 1 does not exist');
        });
    });
    describe('Edit a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });

            const res = await authenticatedUser
                .patch('/tasks/1')
                .send({ data: { type: 'tasks', attributes: { title: 'Buy better PC' } } });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not part of that project!');
        });
        it('allow asignee only if it participates in project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Task.create({ title: 'B', details: 'f', projectId: 1, isDone: false });

            const res = await authenticatedUser
                .patch('/tasks/1')
                .send({ relationships: { assignee: { type: 'users', id: 2 } } });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('Asignee must be a project participator');
        });
    });
    describe('Delete a Task', () => {
        it('allow only if you are in the project', async () => {
            await User.create({
                username: 't',
                password: '$',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({ title: 'C', details: '', managerId: 2 });
            await Task.create({ title: 'B', details: 'f', projectId: 2, isDone: false });

            const res = await authenticatedUser.delete('/tasks/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not part of that project!');
        });
    });
});
