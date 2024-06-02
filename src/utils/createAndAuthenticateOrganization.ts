import { FastifyInstance } from "fastify";
import request from 'supertest';

export async function createAndAuthenticateOrganization(app: FastifyInstance) {
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

  const { body: { token }} = await request(app.server)
    .post('/organization/auth')
    .send({
      email: 'petorg@example.com',
      password: '123456'
    })

  return { token };
}