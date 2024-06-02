import { Organization, Prisma } from "@prisma/client"

export interface OrganizationRepositoryInterface {
  create(data: Prisma.OrganizationCreateInput): Promise<Organization>;
  findByEmail(email: string): Promise<Organization | null>;
}