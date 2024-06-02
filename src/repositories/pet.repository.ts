import { FetchPetsRequest } from "@/use-cases/fetch-pets/fetch-pets-use-case";
import { Prisma } from "@prisma/client";
import { PetRepositoryInterface } from "./interfaces/pet-repository.interface";
import { prisma } from "@/lib/prisma";

export class PetRepository implements PetRepositoryInterface {
  create(data: Prisma.PetUncheckedCreateInput) {
    return prisma.pet.create({ data: {
      name: data.name,
      birth: data.birth,
      type: data.type,
      details: data.details,
      size: data.size,
      energyLevel: data.energyLevel,
      environment: data.environment,
      adoptionRequirements: data.adoptionRequirements,
      organization: {
        connect: {
          id: data.organization_id
        }
      }
    } });
  }

  fetch(data: FetchPetsRequest) {
    return prisma.pet.findMany({
      where: {
        size: data.size,
        energyLevel: data.energyLevel,
        environment: data.environment, 
        type: data.type,
        birth: {
          gte: data.birth,
          lte:  new Date(),
        },
        organization: {
          city: data.city,
        }
      }
    })
  }

  findById(petId: string) {
    return prisma.pet.findUnique({ where: { id: petId } });
  }
}