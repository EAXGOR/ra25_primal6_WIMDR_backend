/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IFieldResolver, UserInputError, ApolloError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { Context } from '../../context';
import { DBUser } from '../../dbTypes/dbUser';
import { DBLocation } from '../../dbTypes/dbLocation';
import { haversineFormula } from '../../utils/helpers';

export const getEmergencyAlert: IFieldResolver<null, Context> = async (_, { input }, ctx) => {
  const { db, isValid, jwt } = ctx;
  const { latitude, longitude } = input;
  if (!latitude || !longitude) throw new UserInputError('Input_Error. Some of the required inputs are not provided');

  const userCol = db.collection<DBUser>('users');
  const locationsCol = db.collection<DBLocation>('locations');

  const activePriority = await userCol.find({ currentEmergency: { $ne: null } }).toArray();
  const activePriorityLocationIDs = await activePriority.map((a) => new ObjectID(a.location));
  const activePriorityLocations = await locationsCol.find({ _id: { $in: activePriorityLocationIDs } }).toArray();

  const matchUsersIDs = await activePriorityLocations.map((location) => {
    const distanceWithUser = haversineFormula(
      Number(latitude),
      Number(longitude),
      Number(location.latitude),
      Number(location.longitude)
    );
    if (distanceWithUser <= 2000) return location.user;
  });

  const matchedUsers = await userCol.find({ _id: { $in: matchUsersIDs } }).toArray();
  const matchedEmergenciesIDs = await matchedUsers.map((u) => {
    return { id: u.currentEmergency.toHexString() };
  });

  if (isValid) {
    try {
      await locationsCol.update({ user: new ObjectID(jwt.id) }, { $set: { longitude, latitude } });
    } catch {
      throw new ApolloError('updation_failed. Failed to update location of the user.');
    }
  }
  return matchedEmergenciesIDs.length > 0 ? matchedEmergenciesIDs : null;
};
