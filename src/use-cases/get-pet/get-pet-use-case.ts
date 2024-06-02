import { PetRepositoryInterface } from "@/repositories/interfaces/pet-repository.interface";
import { ResourceNotFoundError } from "../@errors/resource-not-found.error";
import { Pet } from "@prisma/client";

interface GetPetRequest {
  petId: string;
}

interface GetPetResponse {
  pet: Pet;
}

export class GetPetUseCase {
  constructor(
    private petRepository: PetRepositoryInterface
  ) {}

  async execute({ petId }: GetPetRequest): Promise<GetPetResponse> {
    const pet = await this.petRepository.findById(petId)

    if(!pet) throw new ResourceNotFoundError();

    return {
      pet
    }
  }
}