import { Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class ClaimsService {
  constructor(private readonly rolesService: RolesService) {}

  async getClaimsForUser(user :any): Promise<any[]> {
    const roleName = user.role.name;
    const role = await this.rolesService.findRoleByName(roleName);
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }
    const claims = [...role.claims];
    claims.push({
      action: 'manage',
      subject: 'Item',
      conditions: { userId: user.userId },
    });
    
    claims.push({
      action: 'read',
      subject: 'User',
      conditions: { userId: user.userId },
    });
    return claims;
  }
}