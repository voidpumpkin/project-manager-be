const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Project, User, ProjectParticipator } = require('../../models');

describe('business : Project', () => {
    let authenticatedUser, authenticatedUserDBInst;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        authenticatedUserDBInst = await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W'
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get project', () => {
        it('allow only when you are participator', async () => {
            await User.create({ username: 'a', password: 'a' });
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            try {
                const res = await authenticatedUser.get('/projects/1');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'You are not participating in this project'
                );
            } catch (err) {
                throw err;
            }
        });
    });

    describe('Get participators of a project', () => {
        it('allow only when you are project participator', async () => {
            const user = await User.create({ username: 'a', password: 'a' });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(user);
            try {
                const res = await authenticatedUser.get('/projects/1/relationships/participators');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'You are not participating in this project'
                );
            } catch (err) {
                throw err;
            }
        });
    });

    describe('Create a project', () => {
        it('allow only self as a manager', async () => {
            await User.create({ username: 'a', password: 'a' });
            try {
                const res = await authenticatedUser.post('/projects').send({
                    data: {
                        type: 'projects',
                        attributes: {
                            title: 'Create character',
                            details: 'just copy from internet'
                        }
                    },
                    relationships: {
                        manager: {
                            type: 'users',
                            id: 2
                        }
                    }
                });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('Manager can only be set as yourself');
            } catch (err) {
                throw err;
            }
        });
        it('automaticly add myself as a paticipator', async () => {
            try {
                const res = await authenticatedUser.post('/projects').send({
                    data: {
                        type: 'projects',
                        attributes: {
                            title: 'Create character',
                            details: 'just copy from internet'
                        }
                    }
                });
                const projectParticipator = await ProjectParticipator.findOne({
                    where: { projectId: 1, participatorId: 1 }
                });
                expect(projectParticipator).to.be.not.null;
                expect(res.status).to.equal(201);
            } catch (err) {
                throw err;
            }
        });
    });

    describe('Edit project', () => {
        it('allow only when you are participator', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            try {
                const res = await authenticatedUser.patch('/projects/1').send({
                    data: {
                        type: 'projects',
                        attributes: {
                            title: 'hi'
                        }
                    }
                });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'You are not participating in this project'
                );
            } catch (err) {
                throw err;
            }
        });
        it('allow only when you are manager', async () => {
            await User.create({ username: 'a', password: 'a' });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(authenticatedUserDBInst);
            try {
                const res = await authenticatedUser.patch('/projects/1').send({
                    data: {
                        type: 'projects',
                        attributes: {
                            title: 'hi'
                        }
                    }
                });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'Projects can be edited only by project managers'
                );
            } catch (err) {
                throw err;
            }
        });
    });
    describe('Delete project', () => {
        it('allow only when you are participator', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            try {
                const res = await authenticatedUser.delete('/projects/1');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'You are not participating in this project'
                );
            } catch (err) {
                throw err;
            }
        });
        it('allow only when you are manager', async () => {
            await User.create({ username: 'a', password: 'a' });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(authenticatedUserDBInst);
            try {
                const res = await authenticatedUser.delete('/projects/1');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'Projects can be deleted only by project managers'
                );
            } catch (err) {
                throw err;
            }
        });
    });
    describe('Add project participator', () => {
        it('allow only when you are manager', async () => {
            await User.create({ username: 'a', password: 'a' });
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            try {
                const res = await authenticatedUser.post('/projects/1/participators').send({
                    participatorId: 1
                });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal(
                    'Participators can be added only when you are the Project manager'
                );
            } catch (err) {
                throw err;
            }
        });
    });
});
