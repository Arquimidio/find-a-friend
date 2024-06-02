import { FetchPetsRequest } from "@/use-cases/fetch-pets/fetch-pets-use-case";
import { Pet, Prisma } from "@prisma/client";

export interface PetRepositoryInterface {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>;
  fetch(data: FetchPetsRequest): Promise<Pet[]>;
  findById(petId: string): Promise<Pet | null>;
}