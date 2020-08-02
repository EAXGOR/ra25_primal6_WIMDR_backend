import { ObjectID } from 'mongodb';
import { AllowedRole } from '../gqlTypes/types';

export interface DBUser {
  _id: ObjectID;
  name: string;
  email: string;
  phone: string;
  password: string;
  verified: boolean;
  roles: AllowedRole[];
  timeSt: string;
  location: ObjectID;
  currentEmergency: ObjectID;
  emergenciesHandled: ObjectID[];
  emergenciesCreated: ObjectID[];
  validatedUsers: ObjectID[];
  docs: ObjectID[];
  validatedBy: ObjectID;
  emergencyRequests: ObjectID[];
}
