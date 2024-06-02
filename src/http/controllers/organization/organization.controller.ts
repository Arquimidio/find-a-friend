import { EmailAlreadyRegisteredError } from "@/use-cases/@errors/email-already-registered.error";
import { InvalidCredentialsError } from "@/use-cases/@errors/invalid-credentials.error";
import { makeAuthenticateOrganizationUseCase } from "@/use-cases/@factories/make-authenticate-organization-use-case";
import { makeCreateOrganizationUseCase } from "@/use-cases/@factories/make-create-organization-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createOrganizationUseCase = makeCreateOrganizationUseCase();
  
    const organizationCreationSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
      city: z.string(),
      address: z.string(),
      cep: z.string(),
      phone: z.string(),
    })
  
    const zodParseData = organizationCreationSchema.parse(request.body);
  
    const { organization } = await createOrganizationUseCase.execute({ data: zodParseData });
  
    reply.status(201).send({ organization });
  } catch (e) {
    if(e instanceof EmailAlreadyRegisteredError) return reply.status(400).send({ message: e.message });

    throw e;
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authSchema = z.object({
    email: z.string(),
    password: z.string().min(6),
  })

  const authenticateOrganizationUseCase = makeAuthenticateOrganizationUseCase();

  const { email, password } = authSchema.parse(request.body);

  try {
    const { organization } = await authenticateOrganizationUseCase.execute({ email, password})

    const token = await reply.jwtSign({}, {
      sign: {
        sub: organization.id
      },
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: organization.id,
        expiresIn: '7d',
      }
    })

    reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({ token });
  } catch (e) {
    if(e instanceof InvalidCredentialsError) return reply.status(400).send({ message: 'Invalid Credentials.' });
    throw e;
  }
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true });

  const { sub } = request.user;

  const token = await reply.jwtSign({}, {
    sign: {
      sub
    }
  })

  const refreshToken = await reply.jwtSign({}, {
    sign: {
      sub,
      expiresIn: '7d'
    }
  })

  reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}