import { Injectable,forwardRef, Inject, BadRequestException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument} from './schemas/users.schema';
import { AuthService } from './auth.service';  
import { CreateUserDto } from '../users/dto/user.dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>, 
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly rolesService:RolesService  
  ) {}
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const { email, password, username, role} = createUserDto;
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const userRole = await this.rolesService.findRoleByName(role || 'default role');
    const hash= await this.authService.hashPassword(password);  
    const newUser = new this.userModel({ email, password: hash, username, role:userRole._id});
    return newUser.save();  
  }
  
  async assignRoleToUser(userId: string, roleName: string) {

    const role = await this.rolesService.findRoleByName(roleName);
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role._id;
    return user.save();
  }

  async findUserByEmail(email: string): Promise<UserDocument|{role:Role}> {
    const user = await this.userModel.findOne({ email }).populate('role').exec();
    console.log('Found user:', user);
    return user;
   }

  async findUserById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();  
  }
}