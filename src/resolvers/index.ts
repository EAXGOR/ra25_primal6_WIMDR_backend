import { IResolvers } from 'apollo-server-express';
import { Context } from '../context';
import { Doc } from './custom/doc';
import { Location } from './custom/location';
import { Emergency } from './custom/emergency';
import { BaseUser, User, Admin, PriorityUser } from './custom/user';
import { Mutation } from './mutation/index';
import { Query } from './query/index';
import { AnyUser } from './custom/shared';

const resolvers: IResolvers<null, Context> = {
  Query,
  Mutation,
  Doc,
  Location,
  Emergency,
  BaseUser,
  User: { ...BaseUser, ...User },
  Admin: { ...BaseUser, ...Admin },
  PriorityUser: { ...BaseUser, ...PriorityUser },
  AnyUser,
};

export default resolvers;
