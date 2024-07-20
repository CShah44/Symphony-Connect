export {};

// Create a type for the roles
export type Roles = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    public_metadata: {
      userId: string;
      role?: Roles;
      onboarded?: boolean;
    };
  }
}
