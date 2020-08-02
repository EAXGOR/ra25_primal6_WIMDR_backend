import { IResolverObject } from 'apollo-server-express';
import { Context } from '../../context';
import { getEmergencyAlert } from './getEmergencyAlert';
import { me } from './me';
import { getCurrent } from './getCurrent';
import { getRequests } from './getRequests';

export const Query: IResolverObject<{ id: string }, Context> = {
  ping: (): string => 'pong',
  getEmergencyAlert,
  me,
  getCurrent,
  getRequests,
};
