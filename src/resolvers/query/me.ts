/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IFieldResolver, ApolloError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';

export const me: IFieldResolver<null, Context> = async (_, __, ctx) => {
  const { db, isValid, jwt } = ctx;
  if (!isValid) throw new ApolloError('Not a valid user');
  const userCol = db.collection<DBUser>('users');
  const Resuser = await userCol.findOne({ _id: new ObjectID(jwt.id) });
  console.log(Resuser);
  return { id: Resuser._id.toHexString() };
};
