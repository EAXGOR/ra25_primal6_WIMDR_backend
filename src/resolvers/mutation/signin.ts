import { IFieldResolver, UserInputError, ApolloError } from 'apollo-server-express';
import { TransactionOptions } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import config from '../../config';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';
import { DBLocation } from '../../dbTypes/dbLocation';

export const signin: IFieldResolver<null, Context> = async (_, { input }, ctx) => {
  const { db, client, res } = ctx;
  const { email, password } = input;
  const { latitude, longitude } = input.location;
  if (!email || !password || !latitude || !longitude)
    throw new UserInputError('Input_Error. Some of the required inputs are not provided');

  const userColl = db.collection<DBUser>('users');
  const locationCol = db.collection<DBLocation>('locations');

  const user = await userColl.findOne({ email });
  if (!user) throw new ApolloError('There is no account with this mail ID');
  if (!user.verified)
    throw new ApolloError('InValid_User. User is not verified. Please visit your email to verify your account.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new ApolloError('Invalid username or password');

  const payload = {
    email: user.email,
    roles: user.roles,
    id: user._id.toHexString(),
  };
  const token = jwt.sign(payload, config.JWTSecret, {
    algorithm: 'HS512',
    subject: 'login',
    expiresIn: config.JWTExpiry,
  });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: ms(config.JWTExpiry),
  });

  res.cookie('signedin', true, {
    sameSite: 'strict',
    maxAge: ms(config.JWTExpiry),
  });

  const session = client.startSession();
  const trxOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' },
  };

  try {
    await session.withTransaction(async () => {
      locationCol.update({ _id: user.location }, { $set: { longitude, latitude } }, { session });
    }, trxOptions);
  } catch {
    console.error('trx failed');
    throw new ApolloError('An error occured while performing trxn on DB');
  } finally {
    session.endSession();
  }

  return {
    code: '200',
    message: 'SignIn successful',
  };
};
