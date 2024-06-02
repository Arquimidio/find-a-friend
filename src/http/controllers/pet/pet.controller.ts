import { ResourceNotFoundError } from "@/use-cases/@errors/resource-not-found.error";
import { makeCreatePetUseCase } from "@/use-cases/@factories/make-create-pet-use-case";
import { makeFetchPetsUseCase } from "@/use-cases/@factories/make-fetch-pets-use-case";
import { makeGetPetUseCase } from "@/use-cases/@factories/make-get-pet-use-case";
import { PetEnergyLevel, PetEnvironmentSize, PetSize, PetType } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPetUseCase = makeCreatePetUseCase();

  const createPetSchema = z.object({
    name: z.string(),
    birth: z.coerce.date(),
    type: z.nativeEnum(PetType),
    details: z.string(),
    size: z.nativeEnum(PetSize),
    energyLevel: z.nativeEnum(PetEnergyLevel),
    adoptionRequirements: z.array(z.string()),
    environment: z.nativeEnum(PetEnvironmentSize),
  });

  const petToBeCreated = createPetSchema.parse(request.body);

  const { pet } = await createPetUseCase.execute({
    data: {
      ...petToBeCreated,
      organization_id: request.user.sub
    }
  })

  reply.status(201).send({ pet });
}

export async function fetchPets(request: FastifyRequest, reply: FastifyReply) {
  const fetchPetsUseCase = makeFetchPetsUseCase();
  
  const fetchPetsSchema = z.object({
    energyLevel: z.nativeEnum(PetEnergyLevel).optional(),
    environment: z.nativeEnum(PetEnvironmentSize).optional(),
    type: z.nativeEnum(PetType).optional(),
    birth: z.date().optional(),
    size: z.nativeEnum(PetSize).optional(),
    city: z.string()
  })

  const validatedQuery = fetchPetsSchema.parse(request.query);

  const { pets } = await fetchPetsUseCase.execute(validatedQuery);

  reply.status(200).send({ pets });
}

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const getPetUseCase = makeGetPetUseCase();

  const getPetSchema = z.object({
    petId: z.string().uuid(),
  })

  const { petId } = getPetSchema.parse(request.params);

  try {
    const { pet } = await getPetUseCase.execute({ petId });
  
    reply.status(200).send({ pet });
  } catch (e) {
    if(e instanceof ResourceNotFoundError) return reply.status(404).send({ message: 'Resource not found.' });
    throw e;
  }
}