import { Document } from 'mongoose';
import { Role } from '../../roles/roles.schema';

export interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  role: Role;
  toObject: () => Record<string, any>; 
}