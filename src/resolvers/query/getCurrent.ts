/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IFieldResolver, ApolloError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';
import { AllowedRole } from '../../gqlTypes/types';

export const getCurrent: IFieldResolver<null, Context> = async (_, __, ctx) => {
  const { db, isValid, jwt } = ctx;
  if (!isValid) throw new ApolloError('Not a valid user');
  const userCol = db.collection<DBUser>('users');
  const Resuser = await userCol.findOne({ _id: new ObjectID(jwt.id) });
  if (!Resuser.roles.includes(AllowedRole.PRIORITY_USER)) throw new ApolloError('UnAuthorized');
  return Resuser.currentEmergency ? { id: Resuser.currentEmergency.toHexString() } : null;
};
