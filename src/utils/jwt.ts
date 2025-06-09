import {jwtDecode} from "jwt-decode";

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role?: {
    id: string;
    roleName: string;
  };
  iat?: number;
  exp?: number;
}

export function getUserFromToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
