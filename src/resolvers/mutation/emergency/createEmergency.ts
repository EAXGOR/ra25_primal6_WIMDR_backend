/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IFieldResolver, UserInputError, ApolloError } from 'apollo-server-express';
import { TransactionOptions, ObjectID } from 'mongodb';
import { Context } from '../../../context';
import { DBUser } from '../../../dbTypes/dbUser';
import { DBLocation } from '../../../dbTypes/dbLocation';
import { DBEmergency } from '../../../dbTypes/dbEmergency';
import { DBDoc } from '../../../dbTypes/dbDocs';
import { EmergencyStatus, AllowedRole } from '../../../gqlTypes/types';
import { haversineFormula } from '../../../utils/helpers';

export const createEmergency: IFieldResolver<null, Context> = async (_, { input }, ctx) => {
  const { db, client, isValid, jwt } = ctx;
  let { docs } = input;
  const { self } = input;
  const { description } = input;
  if (docs === undefined) docs = null;
  const { latitude, longitude } = input.location;
  if (!description || !latitude || !longitude)
    throw new UserInputError('Input_Error. Some of the required inputs are not provided');

  const userColl = db.collection<DBUser>('users');
  const locationCol = db.collection<DBLocation>('locations');
  const emergencyCol = db.collection<DBEmergency>('emergencies');
  const docCol = db.collection<DBDoc>('docs');

  if (!isValid) throw new ApolloError('UnAuthorized. You are not authorized to perform this action');
  const emergencyID = new ObjectID();
  const locationID = new ObjectID();
  let docIDs;
  if (docs) {
    docIDs = docs.map(() => new ObjectID());
  } else {
    docIDs = null;
  }

  const newEmergency: DBEmergency = {
    _id: emergencyID,
    location: locationID,
    status: EmergencyStatus.PENDING,
    raisedBy: new ObjectID(jwt.id),
    handledBy: null,
    previousAssignees: [],
    active: true,
    docs: docIDs || [],
    description,
    timeSt: new Date().toISOString(),
  };
  console.log('emer->docs', newEmergency.docs);

  const newLocation: DBLocation = {
    _id: locationID,
    longitude,
    latitude,
    direction: null,
    speed: null,
    user: null,
    emergency: emergencyID,
    timeSt: new Date().toISOString(),
  };
  const newDocs: DBDoc[] = docs
    ? await docIDs.map((docID: ObjectID, index: number) => {
        return {
          _id: docID,
          desc: description,
          filename: docs[index].filename,
          mime: docs[index].mime,
          url: docs[index].url,
          createdBy: new ObjectID(jwt.id),
          emergency: emergencyID,
        };
      })
    : [];

  if (self === true) {
    const selfUser = await userColl.findOne({ _id: new ObjectID(jwt.id) });
    if (!selfUser.roles.includes(AllowedRole.PRIORITY_USER)) throw new ApolloError('User not Authorized.');
    newEmergency.handledBy = new ObjectID(jwt.id);
    const session = client.startSession();
    const trxOptions: TransactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' },
    };

    try {
      await session.withTransaction(async () => {
        await userColl.updateOne(
          { _id: new ObjectID(jwt.id) },
          { $push: { emergenciesCreated: emergencyID }, $set: { currentEmergency: emergencyID } },
          { session }
        );
        if (docs) await docCol.insertMany(newDocs, { session });
        await emergencyCol.insertOne(newEmergency, { session });
        return locationCol.insertOne(newLocation, { session });
      }, trxOptions);
    } catch {
      console.error('trx failed');
      throw new ApolloError('An error occured while performing trxn on DB');
    } finally {
      session.endSession();
    }
    return {
      code: '200',
      message: 'successfully created emergency',
      emergency: {
        id: emergencyID.toHexString(),
      },
    };
  }

  const priorityUsers = await userColl.find({ roles: AllowedRole.PRIORITY_USER }).toArray();

  const priorityUsersLocationIDs = await priorityUsers.map((user) => user.location);
  const priorityUsersLocations = await locationCol.find({ _id: { $in: priorityUsersLocationIDs } }).toArray();

  const matchedLocationUsersIDs = await priorityUsersLocations.map((location) => {
    const dist = haversineFormula(
      Number(latitude),
      Number(longitude),
      Number(location.latitude),
      Number(location.longitude)
    );
    if (dist <= 50) return new ObjectID(location.user);
  });

  newEmergency.previousAssignees = matchedLocationUsersIDs;

  const session = client.startSession();
  const trxOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' },
  };

  try {
    await session.withTransaction(async () => {
      await userColl.updateMany(
        { _id: { $in: matchedLocationUsersIDs } },
        { $push: { emergencyRequests: emergencyID } },
        { session }
      );
      await userColl.updateOne(
        { _id: new ObjectID(jwt.id) },
        { $push: { emergenciesCreated: emergencyID } },
        { session }
      );
      if (docs) await docCol.insertMany(newDocs, { session });
      await emergencyCol.insertOne(newEmergency, { session });
      return locationCol.insertOne(newLocation, { session });
    }, trxOptions);
  } catch {
    console.error('trx failed');
    throw new ApolloError('An error occured while performing trxn on DB');
  } finally {
    session.endSession();
  }
  return {
    code: '200',
    message: 'successfully created emergency',
    emergency: {
      id: emergencyID.toHexString(),
    },
  };
};
