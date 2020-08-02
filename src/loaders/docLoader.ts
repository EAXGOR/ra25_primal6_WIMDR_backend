import { Db, ObjectID } from 'mongodb';
import { DBDoc } from '../dbTypes/dbDocs';

export const batchDocs = async (ids: readonly string[], db: Db): Promise<DBDoc[]> => {
  console.log('fetching docIDs=>', ids);
  const objIDs = ids.map((id) => new ObjectID(id));
  const docs = await db
    .collection<DBDoc>('emergencies')
    .find({ _id: { $in: objIDs } })
    .toArray();

  const itemMap = new Map();
  docs.forEach((a, index) => {
    itemMap.set(a._id.toHexString(), index);
  });

  const sorted = ids.map((id) => {
    const i = itemMap.get(id);
    if (i === undefined) return null;
    return docs[i];
  });

  return sorted;
};
