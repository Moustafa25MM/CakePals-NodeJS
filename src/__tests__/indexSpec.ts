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
