import { FastifyInstance } from "fastify";
import { authenticate, create, refresh } from "./organization.controller";

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organization', create);
  app.post('/organization/auth', authenticate);
  app.patch('/token/refresh', refresh);
}