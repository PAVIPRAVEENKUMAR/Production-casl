import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesService } from '../roles/roles.service';


@Injectable()
export class ClaimsService {
  constructor(private readonly rolesService: RolesService) {}

  async getClaimsForUser(user :any): Promise<any[]> {
    const role= user.role?.name;
    if(!role){
      throw new BadRequestException('Role is undefined');
    }
    const userrole = await this.rolesService.findRoleByName(role);
    if (!userrole) {
      throw new BadRequestException(`Role '${userrole}' not found`);
    }
    
    return userrole.claims;
  }
}