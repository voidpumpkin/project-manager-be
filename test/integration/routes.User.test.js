const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, User } = require('../../models');

describe('routes : User', () => {
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
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe('GET /users', () => {
        it('should return users', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.get('/users');
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.data).to.have.length(2);
            expect(res.body.data[0].id).to.equal(1);
            expect(res.body.data[0].type).to.equal('users');
            expect(res.body.data[0].links.self).to.equal('/users/1');
            expect(res.body.data[1].id).to.equal(2);
            expect(res.body.data[1].type).to.equal('users');
            expect(res.body.data[1].links.self).to.equal('/users/2');
        });
        it('no auth', async () => {
            const res = await chai.request(server).get('/users');
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });

    describe('GET /users/:id', () => {
        it('should return user', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.get('/users/2');
            expect(res.status).to.equal(200);
            expect(res.type).to.equal('application/json');
            expect(res.body.data.attributes.username).to.equal('bob');
        });
        it('user does not exist', async () => {
            const res = await authenticatedUser.get('/users/2');
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('User with id 2 does not exist');
        });
        it('no auth', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await chai.request(server).get('/users/2');
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });

    describe('POST /users', () => {
        it('should hash password', async () => {
            const res = await chai
                .request(server)
                .post('/users')
                .send({
                    data: {
                        type: 'users',
                        attributes: {
                            username: 'bob',
                            password: 'jones',
                            firstName: 'uncle',
                            lastName: 'bob',
                            email: 'uncle@bob.com',
                            phoneNumber: '6664666'
                        }
                    }
                });
            expect(res.status).to.equal(201);
            expect(res.type).to.equal('application/json');
            const { password } = await User.findByPk(2);
            const isPasswordMatching = await bcrypt.compare('jones', password);
            expect(res.body.data.id).to.equal(2);
            expect(res.body.data.attributes.username).to.equal('bob');
            expect(isPasswordMatching).to.equal(true);
        });
        it('should return a user', async () => {
            const res = await chai
                .request(server)
                .post('/users')
                .send({
                    data: {
                        type: 'users',
                        attributes: {
                            username: 'bob',
                            password: 'jones',
                            firstName: 'uncle',
                            lastName: 'bob',
                            email: 'uncle@bob.com',
                            phoneNumber: '6664666'
                        }
                    }
                });
            expect(res.status).to.equal(201);
            expect(res.type).to.equal('application/json');
            expect(res.body.data.id).to.equal(2);
            expect(res.body.data.attributes.username).to.equal('bob');
            expect(res.body.data.attributes.password).to.exist;
        });
        it('username already taken', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await chai
                .request(server)
                .post('/users')
                .send({
                    data: {
                        type: 'users',
                        attributes: {
                            username: 'bob',
                            password: 'jones',
                            firstName: 'uncle',
                            lastName: 'bob',
                            email: 'uncle@bob.com',
                            phoneNumber: '6664666'
                        }
                    }
                });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('username already taken');
        });
    });

    describe('PATCH /users/me', () => {
        it('should update a user username', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser
                .patch('/users/me')
                .send({ data: { type: 'users', attributes: { username: 'sam' } } });
            expect(res.status).to.equal(204);
            const { username, password } = await User.findByPk(1);
            expect(username).to.equal('sam');
            expect(password).to.exist;
        });
        it('username already taken', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser.patch('/users/me').send({
                data: { type: 'users', attributes: { username: 'bob', password: 'jones' } }
            });
            expect(res.status).to.equal(400);
            expect(res.body.errors[0].title).to.equal('username already taken');
        });
        it('should update a user password', async () => {
            const res = await authenticatedUser
                .patch('/users/me')
                .send({ data: { type: 'users', attributes: { password: 'uncle' } } });
            expect(res.status).to.equal(204);
            const { username, password } = await User.findByPk(1);
            const isPasswordMatching = await bcrypt.compare('uncle', password);
            expect(username).to.equal('test');
            expect(isPasswordMatching).to.equal(true);
        });
        it('should update a user nothing', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await authenticatedUser
                .patch('/users/me')
                .send({ data: { type: 'users', attributes: {} } });
            expect(res.status).to.equal(204);
            const { username, password } = await User.findByPk(2);
            expect(username).to.equal('bob');
            expect(password).to.exist;
        });
        it('no auth', async () => {
            await User.create({
                username: 'bob',
                password: 'jones',
                firstName: 'uncle',
                lastName: 'bob',
                email: 'uncle@bob.com',
                phoneNumber: '6664666'
            });

            const res = await chai
                .request(server)
                .patch('/users/me')
                .send({ data: { type: 'users', attributes: { username: 'pinterest' } } });
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });

    describe('DELETE /users/me', () => {
        it('should delete a user', async () => {
            const res = await authenticatedUser.delete('/users/me');
            const user = await User.findByPk(1);
            expect(res.status).to.equal(204);
            expect(user).to.equal(null);
        });
        it('no auth', async () => {
            const res = await chai.request(server).delete('/users/me');
            expect(res.status).to.equal(401);
            expect(res.body.errors[0].title).to.equal('Unauthorized');
        });
    });
});
