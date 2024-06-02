import app from "@/app";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Authenticate organization (e2e)', async () => {
  it('should authenticate an organization correctly', async () => {
    await request(app.server)
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

    const response = await request(app.server)
      .post('/organization/auth')
      .send({
        email: 'petorg@example.com',
        password: '123456'
      })

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining({ token: expect.any(String)}));
  })
})