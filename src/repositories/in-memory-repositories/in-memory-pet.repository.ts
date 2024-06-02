import { Pet, Prisma } from "@prisma/client";
import { PetRepositoryInterface } from "../interfaces/pet-repository.interface";
import { randomUUID } from "crypto";
import moment from "moment";
import { FetchPetsRequest } from "@/use-cases/fetch-pets/fetch-pets-use-case";

export class InMemoryPetRepository implements PetRepositoryInterface {
  public items: Pet[] = [];

  async create(data: Prisma.PetUncheckedCreateInput) {
    const newPet: Pet = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
      organization_id: data.organization_id,
      birth: new Date(data.birth),
      adoptionRequirements: data.adoptionRequirements as Prisma.JsonArray,
    };

    this.items.push(newPet);

    return newPet;
  }

  async fetch(data: FetchPetsRequest) {
    return this.items.filter((pet) => {

      const isInvalid = (
        data.birth && !moment(pet.birth).isBetween(data.birth, new Date()) ||
        data.energyLevel && pet.energyLevel !== data.energyLevel ||
        data.environment && pet.environment !== data.environment ||
        data.type && pet.type !== data.type ||
        data.size && pet.size !== data.size
      )

      return !isInvalid;
    })
  }

  async findById(petId: string) {
    return this.items.find((pet) => pet.id === petId) ?? null;
  }
}