const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Project, Task, User, ProjectParticipator } = require('../../models');

describe('routes : Project', () => {
    // eslint-disable-next-line no-unused-vars
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
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('GET /projects/:id', () => {
        it('should return project', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({ participatorId: 1, projectId: 1 });

            const res = await authenticatedUser.get('/projects/1');
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.data.attributes.title).to.equal('Create character');
            expect(res.body.data.attributes.details).to.equal('just copy from internet');
        });
        it('project does not exist', async () => {
            const res = await authenticatedUser.get('/projects/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('Project with id 1 does not exist');
        });
        it('no auth', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });

            const res = await chai.request(server).get('/projects/1');
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });
    describe('GET /projects/:id/relationships/participators', () => {
        it('should return participator relationships', async () => {
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await project.addParticipator(await User.findByPk(1));

            const res = await authenticatedUser.get('/projects/1/relationships/participators');
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.data).to.be.an('array');
        });
    });

    describe('POST /projects', () => {
        it('should return a project', async () => {
            const res = await authenticatedUser.post('/projects').send({
                data: {
                    type: 'projects',
                    attributes: {
                        title: 'Create character',
                        details: 'just copy from internet'
                    }
                }
            });
            expect(res.status).to.equal(201);
            expect(res.type).to.equal('application/json');
            expect(res.body.data.id).to.equal(1);
            expect(res.body.data.attributes.title).to.equal('Create character');
            expect(res.body.data.attributes.details).to.equal('just copy from internet');
        });
        it('title" is required', async () => {
            const res = await authenticatedUser
                .post('/projects')
                .send({ data: { type: 'projects', attributes: {} } });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because [child "title" fails because ["title" is required]]]'
            );
        });
        it('"title" must be a string', async () => {
            const res = await authenticatedUser
                .post('/projects')
                .send({ data: { type: 'projects', attributes: { title: null } } });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because [child "title" fails because ["title" must be a string]]]'
            );
        });
        it('"title" is not allowed to be empty', async () => {
            const res = await authenticatedUser
                .post('/projects')
                .send({ data: { type: 'projects', attributes: { title: '' } } });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because [child "title" fails because ["title" is not allowed to be empty]]]'
            );
        });
        it('"details" must be a string', async () => {
            const res = await authenticatedUser.post('/projects').send({
                data: { type: 'projects', attributes: { title: 'a', details: null } }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because [child "details" fails because ["details" must be a string]]]'
            );
        });
        it('"projectId" is not allowed', async () => {
            const res = await authenticatedUser.post('/projects').send({
                data: {
                    type: 'projects',
                    attributes: { projectId: 1, title: 'a', details: '' }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because ["projectId" is not allowed]]'
            );
        });
        it('"createdAt" is not allowed', async () => {
            const res = await authenticatedUser.post('/projects').send({
                data: {
                    type: 'projects',
                    attributes: { createdAt: new Date(), title: 'a', details: '' }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because ["createdAt" is not allowed]]'
            );
        });
        it('"updatedAt" is not allowed', async () => {
            const res = await authenticatedUser.post('/projects').send({
                data: {
                    type: 'projects',
                    attributes: { updatedAt: new Date(), title: 'a', details: '' }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'child "data" fails because [child "attributes" fails because ["updatedAt" is not allowed]]'
            );
        });
        it('no auth', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });

            const res = await chai
                .request(server)
                .post('/projects')
                .send({
                    data: {
                        type: 'projects',
                        attributes: {
                            title: 'Create character',
                            details: 'just copy from internet'
                        }
                    }
                });
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });

    describe('PATCH /projects/:id', () => {
        it('should update a project title', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({
                participatorId: 1,
                projectId: 1,
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.patch('/projects/1').send({
                data: {
                    type: 'projects',
                    attributes: { title: 'Draw character' }
                }
            });
            const { id, title, details } = await Project.findByPk(1);
            expect(res.status).to.equal(204);
            expect(id).to.equal(1);
            expect(title).to.equal('Draw character');
            expect(details).to.equal('just copy from internet');
        });
        it('should update a project details', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({
                participatorId: 1,
                projectId: 1,
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.patch('/projects/1').send({
                data: {
                    type: 'projects',
                    attributes: { details: 'just copy from pinterest' }
                }
            });
            const { id, title, details } = await Project.findByPk(1);
            expect(res.status).to.equal(204);
            expect(id).to.equal(1);
            expect(title).to.equal('Create character');
            expect(details).to.equal('just copy from pinterest');
        });
        it('should update a project nothing', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({
                participatorId: 1,
                projectId: 1,
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.patch('/projects/1').send({
                data: {
                    type: 'projects',
                    attributes: {}
                }
            });
            const { title, details } = await Project.findByPk(1);
            expect(res.status).to.equal(204);
            expect(title).to.equal('Create character');
            expect(details).to.equal('just copy from internet');
        });
        it('Project does not exist', async () => {
            const res = await authenticatedUser.patch('/projects/1').send({
                data: {
                    type: 'projects',
                    attributes: { title: 'just copy from pinterest' }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('Project with id 1 does not exist');
        });
        it('no auth', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });

            const res = await chai
                .request(server)
                .patch('/projects/1')
                .send({
                    data: {
                        type: 'projects',
                        attributes: { details: 'just copy from pinterest' }
                    }
                });
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });
    describe('POST /projects/:id/relationships/participators', () => {
        it('should add participator', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await User.create({
                username: 'testo',
                password: 'testo',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser
                .post('/projects/1/relationships/participators')
                .send({ relationships: { participator: { type: 'users', id: 2 } } });
            expect(res.status).to.equal(204);
            const projectInstance = await Project.findByPk(1);
            const relationship = await projectInstance.getParticipator({ where: { id: 2 } });
            expect(relationship).to.exist;
        });
    });

    describe('DELETE /projects/:id', () => {
        it('should delete a project', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({ participatorId: 1, projectId: 1 });

            const res = await authenticatedUser.delete('/projects/1');
            const project = await Project.findByPk(1);
            expect(res.status).to.equal(204);
            expect(project).to.equal(null);
        });
        it('should not delete a project', async () => {
            const res = await authenticatedUser.delete('/projects/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('Project with id 1 does not exist');
        });
        it('should cacade delete a project and its tasks', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            await ProjectParticipator.create({ participatorId: 1, projectId: 1 });
            await Task.create({ title: 'C', details: '', isDone: false, projectId: 1 });

            const res = await authenticatedUser.delete('/projects/1');
            const task = await Task.findByPk(1);
            const project = await Project.findByPk(1);
            expect(res.status).to.equal(204);
            expect(project).to.equal(null);
            expect(task).to.equal(null);
        });
        it('no auth', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });

            const res = await chai.request(server).delete('/projects/1');
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });
});
