/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { IFieldResolver, UserInputError, ApolloError } from 'apollo-server-express';
import { TransactionOptions, ObjectID } from 'mongodb';
import { Context } from '../../../context';
import { DBUser } from '../../../dbTypes/dbUser';
import { DBEmergency } from '../../../dbTypes/dbEmergency';
import { EmergencyStatus, AllowedRole } from '../../../gqlTypes/types';

export const handleEmergency: IFieldResolver<null, Context> = async (_, { input }, ctx) => {
  const { db, client, isValid, jwt } = ctx;
  const { emergencyID } = input;
  if (!emergencyID) throw new UserInputError('Input_Error. Some of the required inputs are not provided');

  const userColl = db.collection<DBUser>('users');

  if (!isValid) throw new ApolloError('UnAuthorized. You are not authorized to perform this action');

  const user = await userColl.findOne({ _id: new ObjectID(jwt.id) });

  if (!user?.roles?.includes(AllowedRole.PRIORITY_USER))
    throw new ApolloError('UnAuthorized. You are not authorized to perform this action');

  const emergencyCol = db.collection<DBEmergency>('emergencies');

  const emergency = await emergencyCol.findOne({ _id: new ObjectID(emergencyID) });

  if (!emergency) throw new ApolloError('No emergency found with given ID.');

  if (emergency.handledBy !== null) throw new ApolloError('This emergency is already handled by someone else');

  const previousAssigneesIDs = emergency.previousAssignees;

  const session = client.startSession();
  const trxOptions: TransactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' },
  };

  try {
    await session.withTransaction(async () => {
      await userColl.updateMany(
        { _id: { $in: previousAssigneesIDs } },
        { $pull: { emergencyRequests: new ObjectID(emergencyID) } }
      );
      await emergencyCol.update(
        { _id: new ObjectID(emergencyID) },
        { $set: { previousAssignees: [], handledBy: new ObjectID(jwt.id), status: EmergencyStatus.ACCEPTED } }
      );
      await userColl.update({ _id: new ObjectID(jwt.id) }, { $set: { currentEmergency: new ObjectID(emergencyID) } });
    }, trxOptions);
  } catch {
    console.error('trx failed');
    throw new ApolloError('An error occured while performing trxn on DB');
  } finally {
    session.endSession();
  }

  return {
    code: '200',
    message: 'successfully assigned Emergency',
    emergency: {
      id: new ObjectID(emergencyID).toHexString(),
    },
  };
};
