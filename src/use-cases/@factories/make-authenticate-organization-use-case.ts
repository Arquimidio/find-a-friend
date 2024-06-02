import { OrganizationRepository } from "@/repositories/organization.repository";
import { AuthenticateOrganizationUseCase } from "../authenticate-organization/authenticate-organization-use-case";

export function makeAuthenticateOrganizationUseCase() {
  const organizationRepository = new OrganizationRepository();

  return new AuthenticateOrganizationUseCase(organizationRepository);
}