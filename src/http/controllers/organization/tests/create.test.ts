import app from "@/app";
import { beforeEach, afterEach, describe, it, expect } from "vitest";
import request from 'supertest';

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Create organization (e2e)', () => {
  it('should create an organization correctly', async () => {
    const response = await request(app.server)
      .post('/organization')
      .send({
        name: 'PetOrg',
        email: 'petorg@example.com',
        password: '123456',
        city: 'Brasília',
        address: 'Av. Cândido de Abreu, 817',
        cep: '80530-908',
        phone: '+55413350-8484',
      });

    expect(response.statusCode).toEqual(201);
  })
})