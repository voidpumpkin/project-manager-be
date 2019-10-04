const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const bcrypt = require('bcrypt');
chai.use(chaiHttp);

const server = require('../../server');
const { sequelize, User, Task } = require('../../models');

describe('routes : User', () => {
    let authenticatedUser;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        await User.create({
            username: 'test',
            password: '$2b$08$HMgLqPMffOj2yZY4qo80eOPkgViVZ6Ri1bESw03ufHLPY4sMurL/W'
        });
        authenticatedUser = chai.request.agent(server);
        await authenticatedUser.post('/login').send({ username: 'test', password: 'test' });
    });

    describe.skip('GET /users', () => {
        it('should return users', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.get('/users');
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body).to.have.length(2);
                expect(res.body[0].username).to.equal('test');
                expect(res.body[0].password).to.exist;
                expect(res.body[1].username).to.equal('bob');
                expect(res.body[1].password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            try {
                const res = await chai.request(server).get('/users');
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe.skip('GET /users/:id', () => {
        it('should return user', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.get('/users/2');
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.username).to.equal('bob');
                expect(res.body.password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it('user does not exist', async () => {
            try {
                const res = await authenticatedUser.get('/users/2');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('User with id 2 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await chai.request(server).get('/users/2');
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe('POST /users', () => {
        it('should hash password', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                const { password } = await User.findByPk(2);
                const isPasswordMatching = await bcrypt.compare('jones', password);
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.id).to.equal(2);
                expect(res.body.username).to.equal('bob');
                expect(isPasswordMatching).to.equal(true);
            } catch (err) {
                throw err;
            }
        });
        it('should return a user', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.id).to.equal(2);
                expect(res.body.username).to.equal('bob');
                expect(res.body.password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it.skip('should return a user when isSystemAdmin true', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.id).to.equal(2);
                expect(res.body.username).to.equal('bob');
                expect(res.body.password).to.exist;
                expect(res.body.isSystemAdmin).to.equal(true);
            } catch (err) {
                throw err;
            }
        });
        it.skip('should return a user when no isSystemAdmin', async () => {
            try {
                const res = await chai
                    .request(server)
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                expect(res.status).to.equal(200);
                expect(res.type).to.equal('application/json');
                expect(res.body.id).to.equal(2);
                expect(res.body.username).to.equal('bob');
                expect(res.body.password).to.exist;
                expect(res.body.isSystemAdmin).to.equal(false);
            } catch (err) {
                throw err;
            }
        });
        it('username already taken', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await chai
                    .request(server)
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('username already taken');
            } catch (err) {
                throw err;
            }
        });
    });

    describe.skip('PUT /users/:id', () => {
        it('should update a user username', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.put('/users/2').send({ username: 'sam' });
                const { username, password } = await User.findByPk(2);
                expect(res.status).to.equal(204);
                expect(username).to.equal('sam');
                expect(password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it('username already taken', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser
                    .post('/users')
                    .send({ username: 'bob', password: 'jones' });
                expect(res.status).to.equal(400);

                expect(res.body.errors[0].title).to.equal('username already taken');
            } catch (err) {
                throw err;
            }
        });
        it('should update a user password', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.put('/users/2').send({ password: 'uncle' });
                const { username, password } = await User.findByPk(2);
                const isPasswordMatching = await bcrypt.compare('uncle', password);
                expect(res.status).to.equal(204);
                expect(username).to.equal('bob');
                expect(isPasswordMatching).to.equal(true);
            } catch (err) {
                throw err;
            }
        });
        it.skip('should update a user isSystemAdmin', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.put('/users/2').send({});
                const { username, password } = await User.findByPk(2);
                expect(res.status).to.equal(204);
                expect(username).to.equal('bob');
                expect(password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it('should update a user nothing', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.put('/users/2').send({});
                const { username, password } = await User.findByPk(2);
                expect(res.status).to.equal(204);
                expect(username).to.equal('bob');
                expect(password).to.exist;
            } catch (err) {
                throw err;
            }
        });
        it('User does not exist', async () => {
            try {
                const res = await authenticatedUser.put('/users/2').send({ username: 'pinterest' });
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('User with id 2 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await chai
                    .request(server)
                    .put('/users/1')
                    .send({ username: 'pinterest' });
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });

    describe.skip('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await authenticatedUser.delete('/users/1');
                const user = await User.findByPk(1);
                expect(res.status).to.equal(204);
                expect(user).to.equal(null);
            } catch (err) {
                throw err;
            }
        });
        it('should not delete a user', async () => {
            try {
                const res = await authenticatedUser.delete('/users/2');
                expect(res.status).to.equal(400);
                expect(res.body.errors[0].title).to.equal('User with id 2 does not exist');
            } catch (err) {
                throw err;
            }
        });
        it('no auth', async () => {
            await User.create({ username: 'bob', password: 'jones' });
            try {
                const res = await chai.request(server).delete('/users/2');
                expect(res.status).to.equal(401);
                expect(res.body.errors[0].title).to.equal('Unauthorized');
            } catch (err) {
                throw err;
            }
        });
    });
});
