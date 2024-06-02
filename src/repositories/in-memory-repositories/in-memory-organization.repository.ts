import { Organization, Prisma } from "@prisma/client";
import { OrganizationRepositoryInterface } from "../interfaces/organization-repository.interface";
import { randomUUID } from "crypto";

export class InMemoryOrganizationRepository implements OrganizationRepositoryInterface {
  items: Organization[];

  constructor() {
    this.items = [];
  }

  async create(data: Prisma.OrganizationCreateInput) {
    const storedOrganization = {
      id: randomUUID(),
      ...data,
      created_at: new Date()
    }

    this.items.push(storedOrganization);

    return storedOrganization;
  }

  async findByEmail(email: string) {
    return this.items.find((org) => org.email === email) ?? null;
  }
}