import { ObjectID } from 'mongodb';

export interface DBLocation {
  _id: ObjectID;
  longitude: string;
  latitude: string;
  direction: string;
  speed: string;
  user: ObjectID;
  emergency: ObjectID;
  timeSt: string;
}
