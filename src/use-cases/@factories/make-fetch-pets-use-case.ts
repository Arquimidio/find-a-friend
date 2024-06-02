import { PetRepository } from "@/repositories/pet.repository";
import { FetchPetsUseCase } from "../fetch-pets/fetch-pets-use-case";

export function makeFetchPetsUseCase() {
  const petRepository = new PetRepository();

  return new FetchPetsUseCase(petRepository);
}