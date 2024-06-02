import { OrganizationRepository } from "@/repositories/organization.repository";
import { CreateOrganizationUseCase } from "../create-organization/create-organization-use-case";

export function makeCreateOrganizationUseCase() {
  const organizationRepository = new OrganizationRepository();

  return new CreateOrganizationUseCase(organizationRepository);
}