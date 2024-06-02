import { PetRepository } from "@/repositories/pet.repository";
import { GetPetUseCase } from "../get-pet/get-pet-use-case";

export function makeGetPetUseCase() {
  const petRepository = new PetRepository();

  return new GetPetUseCase(petRepository);
}