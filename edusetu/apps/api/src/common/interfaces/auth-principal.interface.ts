export interface AuthPrincipal {
  sub: string;
  email?: string;
  name?: string;
  issuer: string;
}
