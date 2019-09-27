const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, Project, User, ProjectParticipator } = require('../../models');

describe('business : Project', () => {
    let authenticatedUser;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W',
            isSystemAdmin: false
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('Create a project', () => {
        it('allow only self as a manager', async () => {
            await User.create({ username: 'a', password: 'a', isSystemAdmin: false });
            try {
                const res = await authenticatedUser.post('/projects').send({
                    title: 'Create character',
                    details: 'just copy from internet',
                    managerId: 2
                });
                expect(res.status).to.equal(400);
                expect(res.text).to.equal('Manager can only be set as yourself');
            } catch (err) {
                throw err;
            }
        });
        it('automaticly add myself as a paticipator', async () => {
            try {
                const res = await authenticatedUser.post('/projects').send({
                    title: 'Create character',
                    details: 'just copy from internet'
                });
                const projectParticipator = await ProjectParticipator.findOne({
                    where: { projectId: 1, participatorId: 1 }
                });
                expect(projectParticipator).to.be.not.null;
                expect(res.status).to.equal(200);
            } catch (err) {
                throw err;
            }
        });
    });

    describe('Add project participator', () => {
        it('allow only when you are manager', async () => {
            await User.create({ username: 'a', password: 'a', isSystemAdmin: false });
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
                expect(res.text).to.equal(
                    'Participators can be added only when you are the Project manager'
                );
            } catch (err) {
                throw err;
            }
        });
    });
});
