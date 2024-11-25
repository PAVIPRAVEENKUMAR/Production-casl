import { SetMetadata } from '@nestjs/common';
import { Action } from '../enums/enums';

export const SetPermissions = (action: Action, subject: string) =>
  SetMetadata('permissions', { action, subject });