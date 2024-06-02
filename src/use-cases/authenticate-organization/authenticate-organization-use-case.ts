import { OrganizationRepositoryInterface } from "@/repositories/interfaces/organization-repository.interface";
import { Organization } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { InvalidCredentialsError } from "../@errors/invalid-credentials.error";

interface AuthenticateOrganizationRequest {
  email: string,
  password: string,
}

interface AuthenticateOrganizationResponse {
  organization: Organization;
}

export class AuthenticateOrganizationUseCase {
  constructor(
    private organizationRepository: OrganizationRepositoryInterface,
  ) {}

  async execute({ email, password }: AuthenticateOrganizationRequest): Promise<AuthenticateOrganizationResponse> {
    const organization = await this.organizationRepository.findByEmail(email);

    if(!organization) throw new InvalidCredentialsError();

    const doPasswordsMatch = await bcrypt.compare(password, organization.password_hash);

    if(!doPasswordsMatch) throw new InvalidCredentialsError();

    return {
      organization
    }
  }
}