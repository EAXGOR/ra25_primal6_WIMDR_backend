import { ObjectID } from 'mongodb';

export interface DBVerify {
  _id?: ObjectID;
  email: string;
  hash: string;
}
