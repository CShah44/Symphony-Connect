export {};

// Create a type for the roles
export type Roles = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    public_metadata: {
      role?: Roles;
      onboarded?: boolean;
    };
  }
}
