import { PetRepositoryInterface } from "@/repositories/interfaces/pet-repository.interface";
import { Pet, Prisma } from "@prisma/client";

interface CreatePetRequest {
  data: Prisma.PetUncheckedCreateInput
}

interface CreatePetResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(
    private petRepository: PetRepositoryInterface
  ) {}

  async execute({ data }: CreatePetRequest): Promise<CreatePetResponse> {
    const pet = await this.petRepository.create(data);

    return {
      pet
    };
  }
}