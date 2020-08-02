import { IResolverObject } from 'apollo-server-express';
import { Emergency as GEmergency } from '../../gqlTypes/types';
import { Context } from '../../context';

export const Emergency: IResolverObject<{ id: string }, Context> = {
  id: async (parent, _, { emergencyLoader }): Promise<GEmergency['id']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency._id.toHexString();
  },
  description: async (parent, _, { emergencyLoader }): Promise<GEmergency['description']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.description;
  },
  location: async (parent, _, { emergencyLoader }): Promise<GEmergency['location']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.location ? { id: emergency.location.toHexString() } : null;
  },
  status: async (parent, _, { emergencyLoader }): Promise<GEmergency['status']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.status;
  },
  raisedBy: async (parent, _, { emergencyLoader }): Promise<GEmergency['raisedBy']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.raisedBy ? { id: emergency.raisedBy.toHexString() } : null;
  },

  handledBy: async (parent, _, { emergencyLoader }): Promise<GEmergency['handledBy']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.handledBy ? { id: emergency.handledBy.toHexString() } : null;
  },
  previousAssignees: async (parent, _, { emergencyLoader }): Promise<GEmergency['previousAssignees']> => {
    const emergency = await emergencyLoader.load(parent.id);

    return emergency.previousAssignees.length > 0
      ? emergency.previousAssignees.map((a) => {
          return { id: a.toHexString() };
        })
      : null;
  },
  active: async (parent, _, { emergencyLoader }): Promise<GEmergency['active']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.active;
  },
  docs: async (parent, _, { emergencyLoader }): Promise<GEmergency['docs']> => {
    const emergency = await emergencyLoader.load(parent.id);
    return emergency.docs.length > 0
      ? emergency.docs.map((d) => {
          return { id: d.toHexString() };
        })
      : null;
  },
};
