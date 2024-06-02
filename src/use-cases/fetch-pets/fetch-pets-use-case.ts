import { PetRepositoryInterface } from "@/repositories/interfaces/pet-repository.interface";
import { Pet, PetEnergyLevel, PetEnvironmentSize, PetSize, PetType, Prisma } from "@prisma/client";

export interface FetchPetsRequest {
  energyLevel?: PetEnergyLevel,
  environment?: PetEnvironmentSize,
  type?: PetType,
  birth?: Date,
  size?: PetSize,
  city?: string,
}

interface FetchPetsResponse {
  pets: Pet[];
}

export class FetchPetsUseCase {
  constructor(
    private petRepository: PetRepositoryInterface,
  ) {}

  async execute(data: FetchPetsRequest): Promise<FetchPetsResponse> {
    const pets = await this.petRepository.fetch(data);

    return {
      pets
    }
  }
}