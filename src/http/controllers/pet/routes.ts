import { FastifyInstance } from "fastify";
import { create, fetchPets, getById } from "./pet.controller";
import { verifyJWT } from "@/http/middleware/verify-jwt";

export async function petRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets);
  app.get('/pets/:petId', getById);

  app.post('/pets', { onRequest: [verifyJWT] }, create);
}