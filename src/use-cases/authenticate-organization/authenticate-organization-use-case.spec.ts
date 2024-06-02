import { beforeEach, describe, expect, it } from "vitest";
import { AuthenticateOrganizationUseCase } from "./authenticate-organization-use-case";
import { InMemoryOrganizationRepository } from "@/repositories/in-memory-repositories/in-memory-organization.repository";
import { hashSync } from "bcryptjs";
import { InvalidCredentialsError } from "../@errors/invalid-credentials.error";

let organizationRepository: InMemoryOrganizationRepository;
let authenticateOrganizationUseCase: AuthenticateOrganizationUseCase;

beforeEach(() => {
  organizationRepository = new InMemoryOrganizationRepository();
  authenticateOrganizationUseCase = new AuthenticateOrganizationUseCase(organizationRepository);
})

describe('AuthenticateOrganizationUseCase', () => {
  it('should be able to authenticate an organization', async () => {
    await organizationRepository.create({
      name: 'PetOrg',
      email: 'petorg@example.com',
      password_hash: hashSync('123456', 6),
      city: 'Brasília',
      address: 'Av. Cândido de Abreu, 817',
      cep: '80530-908',
      phone: '+55413350-8484',
    });
  
    const { organization } = await authenticateOrganizationUseCase.execute({
      email: 'petorg@example.com',
      password: '123456'
    });
  
    expect(organization.id).toEqual(expect.any(String));
  })

  it('should fail if the provided email does not exist', async () => {
    await organizationRepository.create({
      name: 'PetOrg',
      email: 'petorg@example.com',
      password_hash: hashSync('123456', 6),
      city: 'Brasília',
      address: 'Av. Cândido de Abreu, 817',
      cep: '80530-908',
      phone: '+55413350-8484',
    });
  
    await expect(() => authenticateOrganizationUseCase.execute({
      email: 'inexistentmail@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  })

  it('should fail if the provided password is not correct', async () => {
    await organizationRepository.create({
      name: 'PetOrg',
      email: 'petorg@example.com',
      password_hash: hashSync('123456', 6),
      city: 'Brasília',
      address: 'Av. Cândido de Abreu, 817',
      cep: '80530-908',
      phone: '+55413350-8484',
    });
  
    await expect(() => authenticateOrganizationUseCase.execute({
      email: 'petorg@example.com',
      password: 'incorrect-password'
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  })
})