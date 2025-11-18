import { JwtPayload } from "jwt-decode";

export interface User extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}