import { Injectable, UnauthorizedException,Inject, forwardRef, BadRequestException} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';
import { JwtPayload } from '../auth/jwt.payload';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { RolesService } from '../roles/roles.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private rolesService: RolesService) 
    {}
  async validateUser(email: string, password: string): Promise<any> {
    console.log('Validating user with email:', email);
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email id not exits');
    }
    if (!('password' in user)) {
      throw new UnauthorizedException('Invalid user object');
    }
    const isPasswordValid = await this.validatePassword(password, user.password);
    if(user && isPasswordValid){
      const { password: _, ...result } = user.toObject();
      return result; 
    }
    throw new UnauthorizedException('Password invalid');
  }
  
  async login(user: any): Promise<{ access_token: string }> {
    const { name, claims } = await this.rolesService.findRoleById(user.role._id); 
    const payload: JwtPayload = { email: user.email, sub: user._id, role: {name,claims}};
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1d' });
    return { access_token: token };
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      console.log('AuthService - Decoded Token:', decoded);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
 
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hashBuffer = (await scrypt(password, salt, 64)) as Buffer;
    return `${salt}.${hashBuffer.toString('hex')}`;
  }
  async hasRole(decodedToken: any, roles: string[]): Promise<boolean> {
    return roles.includes(decodedToken.role);
  }
  private async validatePassword(password: string, hash:string):Promise<boolean> {
    const [salt, storedPasswordHash] = hash.split('.'); 
    const hashBuffer = (await scrypt(password, salt, 64)) as Buffer;
    const hashb = hashBuffer.toString('hex');
    return hashb === storedPasswordHash;
  }
}