import { PetRepository } from "@/repositories/pet.repository";
import { CreatePetUseCase } from "../create-pet/create-pet-use-case";

export function makeCreatePetUseCase() {
  const petRepository = new PetRepository();

  return new CreatePetUseCase(petRepository);
}