import { Db, ObjectID } from 'mongodb';
import { DBUser } from '../dbTypes/dbUser';

export const batchUsers = async (ids: readonly string[], db: Db): Promise<DBUser[]> => {
  console.log('fetching userIDs=>', ids);
  const objIDs = ids.map((id) => new ObjectID(id));
  const users = await db
    .collection<DBUser>('users')
    .find({ _id: { $in: objIDs } })
    .toArray();

  const itemMap = new Map();
  users.forEach((a, index) => {
    itemMap.set(a._id.toHexString(), index);
  });

  const sorted = ids.map((id) => {
    const i = itemMap.get(id);
    if (i === undefined) return null;
    return users[i];
  });

  return sorted;
};
