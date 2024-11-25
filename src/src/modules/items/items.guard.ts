import { Injectable } from '@nestjs/common';
import { CaslBaseGuard } from '../authz/casl.base.guard';

@Injectable()
export class ItemsGuard extends CaslBaseGuard {
  protected getModuleName(): string {
    return 'Item'; 
  }
}