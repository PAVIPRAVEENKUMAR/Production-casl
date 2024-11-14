import { Request } from 'express';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}