import { Prisma } from "@prisma/client";
import { OrganizationRepositoryInterface } from "./interfaces/organization-repository.interface";
import { prisma } from "@/lib/prisma";

export class OrganizationRepository implements OrganizationRepositoryInterface {
  async create(data: Prisma.OrganizationCreateInput) {
    return prisma.organization.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.organization.findUnique({ where: { email }});
  }
}