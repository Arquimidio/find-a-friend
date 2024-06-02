import { InMemoryPetRepository } from "@/repositories/in-memory-repositories/in-memory-pet.repository";
import { beforeEach, expect, it } from "vitest";
import { CreatePetUseCase } from "./create-pet-use-case";
import { describe } from "node:test";
import { PetEnergyLevel, PetEnvironmentSize, PetSize, PetType } from "@prisma/client";
import { randomUUID } from "node:crypto";

let petRepository: InMemoryPetRepository;
let createPetUseCase: CreatePetUseCase;

beforeEach(() => {
  petRepository = new InMemoryPetRepository();
  createPetUseCase = new CreatePetUseCase(petRepository);
})

describe("CreatePetUseCase", () => {
  it('should be able to create a pet', async () => {
    const { pet: newPet } = await createPetUseCase.execute({ data: {
      name: 'Osvaldo',
      birth: new Date(),
      type: PetType.DOG,
      details: 'Pet Details',
      size: PetSize.MEDIUM,
      energyLevel: PetEnergyLevel.MODERATE,
      adoptionRequirements: ['Requirement 1', 'Requirement 2', 'Requirement 3'],
      environment: PetEnvironmentSize.MEDIUM,
      organization_id: randomUUID()
    }});

    expect(newPet).toEqual(expect.objectContaining({ id: expect.any(String) }));
    expect(petRepository.items.length).toEqual(1);
    expect(petRepository.items).toContain(newPet);
  })
})