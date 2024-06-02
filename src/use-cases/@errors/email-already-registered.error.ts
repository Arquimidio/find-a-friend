export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('An organization is already registered with this e-mail.');
  }
}