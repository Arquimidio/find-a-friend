import { InMemoryOrganizationRepository } from '@/repositories/in-memory-repositories/in-memory-organization.repository';
import { describe, expect, it, beforeEach } from 'vitest';
import { CreateOrganizationUseCase } from './create-organization-use-case';
import bcrypt from 'bcryptjs';

let organizationRepository: InMemoryOrganizationRepository;
let createOrganizationUseCase: CreateOrganizationUseCase;

beforeEach(() => {
  organizationRepository = new InMemoryOrganizationRepository();
  createOrganizationUseCase = new CreateOrganizationUseCase(organizationRepository);
})

describe('CreateOrganizationUseCase', () => {
  it('should be able to create an organization', async () => {
    const { organization: newOrganization } = await createOrganizationUseCase.execute({
      data: {
        name: 'PetOrg',
        email: 'petorg@example.com',
        password: '123456',
        city: 'Brasília',
        address: 'Av. Cândido de Abreu, 817',
        cep: '80530-908',
        phone: '+55413350-8484',
      }
    });

    expect(newOrganization).toEqual(expect.objectContaining({ id: expect.any(String) }));
    expect(organizationRepository.items.length).toEqual(1);
    expect(organizationRepository.items).toEqual([{ ...newOrganization, password_hash: expect.any(String) }]);
  })

  it('should fail if organization email is already registered', async () => {
    await createOrganizationUseCase.execute({
      data: {
        name: 'PetOrg',
        email: 'petorg@example.com',
        password: '123456',
        city: 'Brasília',
        address: 'Av. Cândido de Abreu, 817',
        cep: '80530-908',
        phone: '+55413350-8484',
      }
    });

    await expect(() => createOrganizationUseCase.execute({
      data: {
        name: 'PetOrg',
        email: 'petorg@example.com',
        password: '123456',
        city: 'São Paulo',
        address: 'Av. Alguma Coisa, 1000',
        cep: '80530-908',
        phone: '+55413342-2222',
      }
    })
    ).rejects.toBeInstanceOf(Error)
  })
})