import { InMemoryPetRepository } from "@/repositories/in-memory-repositories/in-memory-pet.repository";
import { beforeEach, it, describe, expect } from "vitest";
import { GetPetUseCase } from "./get-pet-use-case";
import { PetType, PetSize, PetEnergyLevel, PetEnvironmentSize } from "@prisma/client";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "../@errors/resource-not-found.error";

let petRepository: InMemoryPetRepository;
let getPetUseCase: GetPetUseCase;

beforeEach(() => {
  petRepository = new InMemoryPetRepository();
  getPetUseCase = new GetPetUseCase(petRepository);
})

describe('GetPetUseCase', () => {
  it('should be able to find a pet by id', async () => {
    const newPet = await petRepository.create({
      name: 'Osvaldo',
      birth: new Date(),
      type: PetType.DOG,
      details: 'Pet Details',
      size: PetSize.MEDIUM,
      energyLevel: PetEnergyLevel.MODERATE,
      adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
      environment: PetEnvironmentSize.MEDIUM,
      organization_id: randomUUID()
    });

    const { pet } = await getPetUseCase.execute({ petId: newPet.id });

    expect(pet).toEqual(expect.objectContaining({ id: newPet.id }));
  })

  it('should fail if no pets with the given id exist in the database', async () => {
    await petRepository.create({
      name: 'Osvaldo',
      birth: new Date(),
      type: PetType.DOG,
      details: 'Pet Details',
      size: PetSize.MEDIUM,
      energyLevel: PetEnergyLevel.MODERATE,
      adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
      environment: PetEnvironmentSize.MEDIUM,
      organization_id: randomUUID()
    });

    await expect(() => (
      getPetUseCase.execute({ petId: 'inexistent-id' })
    )).rejects.toBeInstanceOf(ResourceNotFoundError);
  })
})