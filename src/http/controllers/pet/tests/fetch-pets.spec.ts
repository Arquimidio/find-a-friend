import app from "@/app";
import { createAndAuthenticateOrganization } from "@/utils/createAndAuthenticateOrganization";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import { PetEnergyLevel, PetEnvironmentSize, PetSize, PetType } from "@prisma/client";
import { randomUUID } from "crypto";

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Fetch pets (e2e)', () => {
  it('should fetch all the pets correctly', async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Osvaldo',
        birth: new Date(),
        type: PetType.DOG,
        details: 'Pet Details',
        size: PetSize.MEDIUM,
        energyLevel: PetEnergyLevel.MODERATE,
        adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
        environment: PetEnvironmentSize.MEDIUM,
        organization_id: randomUUID()
      })

    await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Josney',
        birth: new Date(),
        type: PetType.CAT,
        details: 'Pet Details',
        size: PetSize.BIG,
        energyLevel: PetEnergyLevel.CALM,
        adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
        environment: PetEnvironmentSize.SMALL,
        organization_id: randomUUID()
      })

    await request(app.server)
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

    const response = await request(app.server)
      .get('/pets?city=Brasília')
      .send()
        
    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: PetType.DOG }),
      expect.objectContaining({ type: PetType.CAT }),
      expect.objectContaining({ type: PetType.BIRD })
    ]))
  })
})