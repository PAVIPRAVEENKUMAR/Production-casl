import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { claim } from '../shared/interfaces/claim.interface';

export type Subjects = 'User' | 'Item' | 'all';
export type AppAbility = Ability<[string, string]>;

export function defineAbilityFor(claims: claim[]): AppAbility {
  const { can,cannot, build } = new AbilityBuilder<Ability<[string, string]>>(
    Ability as AbilityClass<AppAbility>,
  );

  claims.forEach((claim) => {
    if (claim.conditions) {
      can(claim.action, claim.subject, claim.conditions);
    } else {
      can(claim.action, claim.subject);
    }
  });

  return build({
    detectSubjectType: (item:any) => item.constructor as ExtractSubjectType<string>,
  });
}