import fastify from 'fastify';
import { organizationRoutes } from './http/controllers/organization/routes';
import fastifyJwt from "@fastify/jwt";
import { env } from './env';
import { petRoutes } from './http/controllers/pet/routes';
import { ZodError } from 'zod';
import fastifyCookie from '@fastify/cookie';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  }
})

app.register(fastifyCookie);

app.register(organizationRoutes);
app.register(petRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format()
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // Add some observation service here, like Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
})

export default app;