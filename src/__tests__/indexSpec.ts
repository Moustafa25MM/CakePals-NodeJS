import request from 'supertest';
import { app } from '../index';
import { Member } from '../models/user/member';
import { Baker } from '../models/user/baker';

describe('POST /register', () => {
  const memberData = {
    type: 'member',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    phoneNumber: '1234567890',
  };

  const bakerData = {
    type: 'baker',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@example.com',
    password: 'password123',
    phoneNumber: '0987654321',
    street: '123 Baker St',
    city: 'Bakerville',
    country: 'Bakerland',
    start: '08:00',
    end: '18:00',
  };

  beforeEach(async () => {
    await Member.deleteMany({});
    await Baker.deleteMany({});
  });

  it('should register a member', async () => {
    const res = await request(app).post('/register').send(memberData);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(memberData.email);
  });

  it('should register a baker', async () => {
    const res = await request(app).post('/register').send(bakerData);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(bakerData.email);
  });
});

describe('POST /login', () => {
  const memberData = {
    type: 'member',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    phoneNumber: '1234567890',
  };

  const bakerData = {
    type: 'baker',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe@example.com',
    password: 'password123',
    phoneNumber: '0987654321',
    street: '123 Baker St',
    city: 'Bakerville',
    country: 'Bakerland',
    start: '08:00',
    end: '18:00',
  };

  beforeEach(async () => {
    await Member.deleteMany({});
    await Baker.deleteMany({});

    await request(app).post('/register').send(memberData);
    await request(app).post('/register').send(bakerData);
  });

  it('should log in a member', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: memberData.email, password: memberData.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(memberData.email);
    expect(res.body.token).toBeDefined();
  });

  it('should log in a baker', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: bakerData.email, password: bakerData.password });

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(bakerData.email);
    expect(res.body.token).toBeDefined();
  });

  it('should not log in with invalid email', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'invalid@example.com', password: memberData.password });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });

  it('should not log in with invalid password', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: memberData.email, password: 'invalidpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password');
  });
});
describe('GET /baker/:id', () => {
  const bakerData = {
    type: 'baker',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'janedoe1@example.com',
    password: 'password123',
    phoneNumber: '0987654321',
    street: '123 Baker St',
    city: 'Bakerville',
    country: 'Bakerland',
    start: '08:00',
    end: '18:00',
  };
  let bakerId: any;

  beforeEach(async () => {
    const res = await request(app).post('/register').send(bakerData);
    bakerId = res.body._id;
  });

  it('should get a baker by id', async () => {
    const res = await request(app).get(`/baker/${bakerId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(bakerId);
  });

  it('should return 404 if baker is not found', async () => {
    const res = await request(app).get(`/baker/651427875a7a726fd430ce23`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Baker not found');
  });
});
