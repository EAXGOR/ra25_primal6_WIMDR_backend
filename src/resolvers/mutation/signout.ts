import { IFieldResolver, ApolloError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';

import ms from 'ms';
import config from '../../config';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';

export const signout: IFieldResolver<null, Context> = async (_, __, ctx) => {
  const { db, res, isValid, jwt } = ctx;

  const userColl = db.collection<DBUser>('users');

  if (!isValid) throw new ApolloError('unAuthenticated User.');
  const user = await userColl.findOne({ _id: new ObjectID(jwt.id) });
  if (!user) throw new ApolloError('There is no account with this mail ID');

  res.cookie('token', 'This is fake', {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: ms(config.JWTExpiry),
  });

  res.cookie('signedin', false, {
    sameSite: 'strict',
    maxAge: ms(config.JWTExpiry),
  });

  return {
    code: '200',
    message: 'SignedOut Successfully',
  };
};
