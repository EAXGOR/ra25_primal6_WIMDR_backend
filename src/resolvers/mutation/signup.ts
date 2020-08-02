import { IFieldResolver, UserInputError, ApolloError } from 'apollo-server-express';
import { TransactionOptions, InsertOneWriteOpResult, WithId, ObjectID } from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';
import { DBVerify } from '../../dbTypes/dbVerify';
import { DBLocation } from '../../dbTypes/dbLocation';
import { AllowedRole } from '../../gqlTypes/types';

export const signup: IFieldResolver<null, Context> = async (_, { input }, ctx) => {
  const { db, client } = ctx;
  const { name, email, phone, password, priority } = input;
  const { latitude, longitude } = input.location;
  if (!name || !email || !phone || !password || !latitude || !longitude)
    throw new UserInputError('Input_Error. Some of the required inputs are not provided');

  const userColl = db.collection<DBUser>('users');
  const verifyCol = db.collection<DBVerify>('verify');
  const locationCol = db.collection<DBLocation>('locations');

  const user = await userColl.findOne({ email });
  if (user) throw new ApolloError('A user already exists with the given mail ID');
  else {
    const userID = new ObjectID();
    const locationID = new ObjectID();
    const hash = await bcrypt.hash(password, 8);
    const verifyHash = uuid();
    const newLocation: DBLocation = {
      _id: locationID,
      longitude,
      latitude,
      direction: null,
      speed: null,
      user: userID,
      emergency: null,
      timeSt: new Date().toISOString(),
    };
    const newUser: DBUser = {
      _id: userID,
      name,
      email,
      phone,
      password: hash,
      verified: true,
      roles: priority ? [AllowedRole.PRIORITY_USER] : [AllowedRole.USER],
      timeSt: new Date().toISOString(),
      location: locationID,
      emergenciesHandled: [],
      emergenciesCreated: [],
      validatedUsers: [],
      docs: [],
      validatedBy: null,
      emergencyRequests: [],
      currentEmergency: null,
    };

    let r: InsertOneWriteOpResult<WithId<DBUser>>;
    const session = client.startSession();
    const trxOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
    };

    try {
      await session.withTransaction(async () => {
        r = await userColl.insertOne(newUser, { session });
        await locationCol.insertOne(newLocation, { session });
        return verifyCol.insertOne({ email, hash: verifyHash }, { session });
      }, trxOptions);
    } catch {
      console.error('trx failed');
      throw new ApolloError('An error occured while performing trxn on DB');
    } finally {
      session.endSession();
    }

    return {
      code: '200',
      message: 'SignUp successful',
      user: {
        id: r.insertedId.toHexString(),
      },
    };
  }
};
