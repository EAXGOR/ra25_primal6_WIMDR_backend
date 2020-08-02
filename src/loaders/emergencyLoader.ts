import { Db, ObjectID } from 'mongodb';
import { DBEmergency } from '../dbTypes/dbEmergency';

export const batchEmergencies = async (ids: readonly string[], db: Db): Promise<DBEmergency[]> => {
  console.log('fetching emergencyIDs=>', ids);
  const objIDs = ids.map((id) => new ObjectID(id));
  const emergencies = await db
    .collection<DBEmergency>('emergencies')
    .find({ _id: { $in: objIDs } })
    .toArray();

  const itemMap = new Map();
  emergencies.forEach((a, index) => {
    itemMap.set(a._id.toHexString(), index);
  });

  const sorted = ids.map((id) => {
    const i = itemMap.get(id);
    if (i === undefined) return null;
    return emergencies[i];
  });

  return sorted;
};
