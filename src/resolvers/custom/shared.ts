import { IResolverOptions } from 'apollo-server-express';
import { Context } from '../../context';
import { AnyUser as GQLAnyUser, AllowedRole } from '../../gqlTypes/types';

export const AnyUser: IResolverOptions<GQLAnyUser, Context> = {
  __resolveType: async ({ id }, { userLoader }) => {
    const user = await userLoader.load(id);
    console.log('any user => ', user);
    const { roles } = user;

    if (roles.includes(AllowedRole.ADMIN)) return 'Admin';

    if (roles.includes(AllowedRole.PRIORITY_USER)) return 'PriorityUser';

    if (roles.includes(AllowedRole.USER)) return 'User';

    return 'User';
  },
};
