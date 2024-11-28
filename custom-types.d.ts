interface AuthUser {
  name: string;
  email: string;
  oauth_provider: string;
  image: string;
  passwords?: string;
}

declare namespace Express {
  export interface Request {
    user?: AuthUser; // Optional user property
  }
}
