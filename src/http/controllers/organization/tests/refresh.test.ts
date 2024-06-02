import app from "@/app";
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import request from "supertest";

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Refresh organization token (e2e)', () => {
  it('should be able to refresh a token', async () => {
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

    const authResponse = await request(app.server)
      .post('/organization/auth')
      .send({
        email: 'petorg@example.com',
        password: '123456'
      })
    
    const cookies = authResponse.get('Set-Cookie') as string[];

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expect.objectContaining({
      token: expect.any(String)
    }))
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  })
})