import { ObjectID } from 'mongodb';
import { EmergencyStatus } from '../gqlTypes/types';

export interface DBEmergency {
  _id: ObjectID;
  location: ObjectID;
  status: EmergencyStatus;
  raisedBy: ObjectID;
  handledBy: ObjectID;
  previousAssignees: ObjectID[];
  active: boolean;
  docs: ObjectID[];
  description: string;
  timeSt: string;
}
