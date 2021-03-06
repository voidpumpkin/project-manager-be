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
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            firstName: 'uncle',
            lastName: 'bob',
            email: 'uncle@bob.com',
            phoneNumber: '6664666'
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Get project', () => {
        it('allow only when you are participator', async () => {
            await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });

            const res = await authenticatedUser.get('/projects/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not participating in this project');
        });
    });

    describe('Get participators of a project', () => {
        it('allow only when you are project participator', async () => {
            const user = await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(user);
            const res = await authenticatedUser.get('/projects/1/relationships/participators');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not participating in this project');
        });
    });

    describe('Create a project', () => {
        it('allow only self as a manager', async () => {
            await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
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
        });
        it('automaticly add myself as a paticipator', async () => {
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
        });
    });

    describe('Edit project', () => {
        it('allow only when you are participator', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            const res = await authenticatedUser.patch('/projects/1').send({
                data: {
                    type: 'projects',
                    attributes: {
                        title: 'hi'
                    }
                }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not participating in this project');
        });
        it('allow only when you are manager', async () => {
            await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(authenticatedUserDBInst);
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
        });
    });
    describe('Delete project', () => {
        it('allow only when you are participator', async () => {
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 1
            });
            const res = await authenticatedUser.delete('/projects/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('You are not participating in this project');
        });
        it('allow only when you are manager', async () => {
            await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            const project = await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            await project.addParticipator(authenticatedUserDBInst);
            const res = await authenticatedUser.delete('/projects/1');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'Projects can be deleted only by project managers'
            );
        });
    });
    describe('Add project participator', () => {
        it('allow only when you are manager', async () => {
            await User.create({
                username: 'a',
                password: 'a',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });
            await Project.create({
                title: 'Create character',
                details: 'just copy from internet',
                managerId: 2
            });
            const res = await authenticatedUser
                .post('/projects/1/relationships/participators')
                .send({
                    relationships: {
                        participator: {
                            type: 'users',
                            id: 1
                        }
                    }
                });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal(
                'Participators can be added only when you are the Project manager'
            );
        });
    });
});
