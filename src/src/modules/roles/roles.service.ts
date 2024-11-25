import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './roles.schema';
import { claim } from '../shared/interfaces/claim.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}
  
  async findRoleByName(name: string): Promise<RoleDocument> {
    console.log(`Searching for role: ${name}`);
    const role = await this.roleModel.findOne({ name }).exec();
    if (!role) {
      console.error(`Role '${name}' not found in the database.`);
      throw new BadRequestException(`Role '${name}' not found`);
    }
    return role;
  }
  async findRoleById(id: string): Promise<Role> {
    const role = await this.roleModel.findById(id).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${id}' not found`);
    }
    return role;
  }

  async createRole(name: string,  claims: claim[]): Promise<RoleDocument> {
    const existingRole = await this.roleModel.findOne({ name }).exec();
    if (existingRole) {
      throw new BadRequestException(`Role '${name}' already exists`);
    }
    const newRole = new this.roleModel({
      name,
      claims,
    });
    return newRole.save();
  }
  
  async getAllRoles(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async addClaimToRole(roleId: string, claim: claim): Promise<RoleDocument> {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role) {
      throw new NotFoundException(`Role with ID '${roleId}' not found`);
    }
    role.claims.push(claim);
    return role.save();
  }
   async removeClaimFromRole(roleId: string, claim: { action: string; subject: string }): Promise<Role> {
    const role = await this.roleModel.findById(roleId);
    role.claims = role.claims.filter(
      (c) => !(c.action === claim.action && c.subject === claim.subject),
    );
    return await role.save();
  }
}