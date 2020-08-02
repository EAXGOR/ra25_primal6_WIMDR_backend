import { IResolverObject } from 'apollo-server-express';
import { Location as GLocation } from '../../gqlTypes/types';
import { Context } from '../../context';

export const Location: IResolverObject<{ id: string }, Context> = {
  id: async (parent, _, { locationLoader }): Promise<GLocation['id']> => {
    const location = await locationLoader.load(parent.id);
    return location._id.toHexString();
  },
  longitude: async (parent, _, { locationLoader }): Promise<GLocation['longitude']> => {
    const location = await locationLoader.load(parent.id);
    return location.longitude;
  },
  latitude: async (parent, _, { locationLoader }): Promise<GLocation['latitude']> => {
    const location = await locationLoader.load(parent.id);
    return location.latitude;
  },
  direction: async (parent, _, { locationLoader }): Promise<GLocation['direction']> => {
    const location = await locationLoader.load(parent.id);
    return location.direction;
  },
  speed: async (parent, _, { locationLoader }): Promise<GLocation['speed']> => {
    const location = await locationLoader.load(parent.id);
    return location.speed;
  },
  emergency: async (parent, _, { locationLoader }): Promise<GLocation['emergency']> => {
    const location = await locationLoader.load(parent.id);
    return location.emergency ? { id: location.emergency.toHexString() } : null;
  },
  user: async (parent, _, { locationLoader }): Promise<GLocation['user']> => {
    const location = await locationLoader.load(parent.id);
    return location.user ? { id: location.user.toHexString() } : null;
  },
};
