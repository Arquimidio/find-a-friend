import app from "@/app";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import request from 'supertest';
import { PetType, PetSize, PetEnergyLevel, PetEnvironmentSize } from "@prisma/client";
import { randomUUID } from "crypto";
import { createAndAuthenticateOrganization } from "@/utils/createAndAuthenticateOrganization";

beforeEach(async () => {
  await app.ready();
})

afterEach(async () => {
  await app.close();
})

describe('Create pet (e2e)', () => {
  it('should create a pet correctly', async () => {
    const { token } = await createAndAuthenticateOrganization(app);

    const response = await request(app.server)
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

    expect(response.statusCode).toEqual(201);
  })
})