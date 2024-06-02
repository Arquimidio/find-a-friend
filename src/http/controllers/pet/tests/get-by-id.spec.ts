import app from "@/app";
import { createAndAuthenticateOrganization } from "@/utils/createAndAuthenticateOrganization";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import { PetType, PetSize, PetEnergyLevel, PetEnvironmentSize } from "@prisma/client";
import { randomUUID } from "crypto";

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Get pet by id (e2e)', () => {
  it('should retrieve the pet by id correctly', async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    const petCreationResponse = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Josney',
        birth: new Date(),
        type: PetType.BIRD,
        details: 'Pet Details',
        size: PetSize.SMALL,
        energyLevel: PetEnergyLevel.VIBRANT,
        adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
        environment: PetEnvironmentSize.BIG,
        organization_id: randomUUID()
      })

    const retrievalResponse = await request(app.server)
      .get(`/pets/${petCreationResponse.body.pet.id}`)
      .send()

    expect(retrievalResponse.statusCode).toEqual(200);
    expect(retrievalResponse.body.pet).toEqual(petCreationResponse.body.pet);
  })
})