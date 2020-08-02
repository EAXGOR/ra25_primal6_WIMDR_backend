import { Db, ObjectID } from 'mongodb';
import { DBLocation } from '../dbTypes/dbLocation';

export const batchLocations = async (ids: readonly string[], db: Db): Promise<DBLocation[]> => {
  console.log('fetching locationIDs=>', ids);
  const objIDs = ids.map((id) => new ObjectID(id));
  const locations = await db
    .collection<DBLocation>('locations')
    .find({ _id: { $in: objIDs } })
    .toArray();

  const itemMap = new Map();
  locations.forEach((a, index) => {
    itemMap.set(a._id.toHexString(), index);
  });

  const sorted = ids.map((id) => {
    const i = itemMap.get(id);
    if (i === undefined) return null;
    return locations[i];
  });

  return sorted;
};
