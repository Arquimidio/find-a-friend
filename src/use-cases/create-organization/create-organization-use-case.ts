import { OrganizationRepositoryInterface } from "@/repositories/interfaces/organization-repository.interface";
import { Prisma } from "@prisma/client";
import { EmailAlreadyRegisteredError } from "../@errors/email-already-registered.error";
import bcrypt from 'bcryptjs';

interface CreateOrganizationRequest {
  data: Omit<Prisma.OrganizationCreateInput, "password_hash"> & { password: string }
}

export class CreateOrganizationUseCase {
  constructor(
    private organizationRepository: OrganizationRepositoryInterface
  ) {}

  async execute({ data }: CreateOrganizationRequest) {
    const isEmailAlreadyRegistered = await this.organizationRepository.findByEmail(data.email);

    if(isEmailAlreadyRegistered) {
      throw new EmailAlreadyRegisteredError()
    }

    const organization = await this.organizationRepository.create({
      name: data.name,
      email: data.email,
      password_hash: await bcrypt.hash(data.password, 6),
      city: data.city,
      address: data.address,
      cep: data.cep,
      phone: data.phone,
    });

    return {
      organization: { ...organization, password_hash: undefined },
    };
  }
}