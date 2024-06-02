import { InMemoryPetRepository } from "@/repositories/in-memory-repositories/in-memory-pet.repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchPetsUseCase } from "./fetch-pets-use-case";
import { PetType, PetSize, PetEnergyLevel, PetEnvironmentSize } from "@prisma/client";
import { randomUUID } from "crypto";
import moment from "moment";

let petRepository: InMemoryPetRepository;
let fetchPetsUseCase: FetchPetsUseCase;

beforeEach(async () => {
  petRepository = new InMemoryPetRepository();
  fetchPetsUseCase = new FetchPetsUseCase(petRepository);

  await petRepository.create({
    name: 'Osvaldo',
    birth: moment().subtract(1, 'years').toDate(),
    type: PetType.DOG,
    details: 'Pet Details',
    size: PetSize.MEDIUM,
    energyLevel: PetEnergyLevel.MODERATE,
    adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
    environment: PetEnvironmentSize.MEDIUM,
    organization_id: randomUUID()
  });

  await petRepository.create({
    name: 'Felice',
    birth: moment().subtract(5, 'years').toDate(),
    type: PetType.CAT,
    details: 'Pet Details',
    size: PetSize.SMALL,
    energyLevel: PetEnergyLevel.MODERATE,
    adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
    environment: PetEnvironmentSize.MEDIUM,
    organization_id: randomUUID()
  });

  await petRepository.create({
    name: 'Birdonei',
    birth: moment().subtract(18, 'months').toDate(),
    type: PetType.BIRD,
    details: 'Pet Details',
    size: PetSize.MEDIUM,
    energyLevel: PetEnergyLevel.HIGH_ENERGY,
    adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
    environment: PetEnvironmentSize.MEDIUM,
    organization_id: randomUUID()
  });
})

describe('FetchPetsUseCase', () => {
  it('should be able to fetch pets using all the filters', async () => {
    const { pets } = await fetchPetsUseCase.execute({
      type: PetType.BIRD,
      birth: moment().subtract(3, 'years').toDate(),
      energyLevel: PetEnergyLevel.HIGH_ENERGY,
      environment: PetEnvironmentSize.MEDIUM,
      size: PetSize.MEDIUM
    })

    expect(pets).toHaveLength(1);
    expect(pets).toEqual([expect.objectContaining({ type: PetType.BIRD })]);
  })

  it('should be able to fetch pets that are puppies', async () => {
    const { pets } = await fetchPetsUseCase.execute({
      birth: moment().subtract(2, 'years').toDate(),
    })

    expect(pets).toHaveLength(2);
    expect(pets).toEqual([
      expect.objectContaining({ type: PetType.DOG }),
      expect.objectContaining({ type: PetType.BIRD }),
    ]);
  })
})