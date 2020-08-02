import { ObjectID } from 'mongodb';

export interface DBDoc {
  _id: ObjectID;
  desc: string;
  filename: string;
  mime: string;
  url: string;
  createdBy: ObjectID;
  emergency: ObjectID;
  timeSt: string;
}
