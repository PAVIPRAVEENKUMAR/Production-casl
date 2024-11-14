import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Article} from '../schemas/article.schema';
import { User } from '../schemas/user.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}
export type Subjects = typeof Article | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  defineAbilityFor(user: User) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
        Ability as AbilityClass<AppAbility>
      );
    if (user.role === 'admin') {
      can(Action.Manage, 'all'); 
    } else {
      can(Action.Read, Article);
      can(Action.Create, Article);

      if (user.permissions.includes('update:article')) {
        can(Action.Update, Article, { authorId: user._id.toString()});
      }
      if (user.permissions.includes('delete:article')) {
        can(Action.Delete, Article, { authorId: user._id.toString() });
      }
    }

    return build({
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}