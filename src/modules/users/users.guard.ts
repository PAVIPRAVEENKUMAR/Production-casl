import { Injectable } from '@nestjs/common';
import { CaslBaseGuard } from '../authz/casl.base.guard';
@Injectable()
export class UsersGuard extends CaslBaseGuard {
  protected getModuleName(): string {
    return 'User';
  }
}
