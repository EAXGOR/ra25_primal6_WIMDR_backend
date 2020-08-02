import { IResolverObject } from 'apollo-server-express';
import {
  BaseUser as GBaseUser,
  Admin as GAdmin,
  User as GUser,
  PriorityUser as GPriorityUser,
} from '../../gqlTypes/types';
import { Context } from '../../context';

export const BaseUser: IResolverObject<{ id: string }, Context> = {
  id: async (parent, _, { userLoader }): Promise<GBaseUser['id']> => {
    const user = await userLoader.load(parent.id);
    return user._id.toHexString();
  },
  name: async (parent, _, { userLoader }): Promise<GBaseUser['name']> => {
    const user = await userLoader.load(parent.id);
    return user.name;
  },
  email: async (parent, _, { userLoader }): Promise<GBaseUser['email']> => {
    const user = await userLoader.load(parent.id);
    return user.email;
  },
  phone: async (parent, _, { userLoader }): Promise<GBaseUser['phone']> => {
    const user = await userLoader.load(parent.id);
    return user.phone;
  },
  verified: async (parent, _, { userLoader }): Promise<GBaseUser['verified']> => {
    const user = await userLoader.load(parent.id);
    return user.verified;
  },
  roles: async (parent, _, { userLoader }): Promise<GBaseUser['roles']> => {
    const user = await userLoader.load(parent.id);
    return user.roles;
  },
  timeSt: async (parent, _, { userLoader }): Promise<GBaseUser['timeSt']> => {
    const user = await userLoader.load(parent.id);
    return user.timeSt;
  },
  location: async (parent, _, { userLoader }): Promise<GBaseUser['location']> => {
    const user = await userLoader.load(parent.id);
    return user.location ? { id: user.location.toHexString() } : null;
  },
};
export const User: IResolverObject<{ id: string }, Context> = {
  emergenciesCreated: async (parent, _, { userLoader }): Promise<GUser['emergenciesCreated']> => {
    const user = await userLoader.load(parent.id);
    return user.emergenciesCreated.length > 0
      ? user.emergenciesCreated.map((e) => {
          return { id: e.toHexString() };
        })
      : null;
  },
};
export const Admin: IResolverObject<{ id: string }, Context> = {
  emergenciesCreated: async (parent, _, { userLoader }): Promise<GAdmin['emergenciesCreated']> => {
    const user = await userLoader.load(parent.id);
    return user.emergenciesCreated.length > 0
      ? user.emergenciesCreated.map((e) => {
          return { id: e.toHexString() };
        })
      : null;
  },
  docs: async (parent, _, { userLoader }): Promise<GAdmin['docs']> => {
    const user = await userLoader.load(parent.id);
    return user.docs.length
      ? user.docs.map((d) => {
          return { id: d.toHexString() };
        })
      : null;
  },
  validatedUsers: async (parent, _, { userLoader }): Promise<GAdmin['validatedUsers']> => {
    const user = await userLoader.load(parent.id);
    return user.validatedUsers.length
      ? user.validatedUsers.map((u) => {
          return { id: u.toHexString() };
        })
      : null;
  },
  validatedBy: async (parent, _, { userLoader }): Promise<GAdmin['validatedBy']> => {
    const user = await userLoader.load(parent.id);
    return user.validatedBy ? { id: user.validatedBy.toHexString() } : null;
  },
};
export const PriorityUser: IResolverObject<{ id: string }, Context> = {
  emergenciesCreated: async (parent, _, { userLoader }): Promise<GPriorityUser['emergenciesCreated']> => {
    const user = await userLoader.load(parent.id);
    return user.emergenciesCreated.length > 0
      ? user.emergenciesCreated.map((e) => {
          return { id: e.toHexString() };
        })
      : null;
  },
  currentEmergency: async (parent, _, { userLoader }): Promise<GPriorityUser['currentEmergency']> => {
    const user = await userLoader.load(parent.id);
    return user.currentEmergency ? { id: user.currentEmergency.toHexString() } : null;
  },
  docs: async (parent, _, { userLoader }): Promise<GPriorityUser['docs']> => {
    const user = await userLoader.load(parent.id);
    return user.docs.length > 0
      ? user.docs.map((d) => {
          return { id: d.toHexString() };
        })
      : null;
  },
  emergenciesHandled: async (parent, _, { userLoader }): Promise<GPriorityUser['emergenciedhandled']> => {
    const user = await userLoader.load(parent.id);
    return user.emergenciesHandled.length > 0
      ? user.emergenciesHandled.map((e) => {
          return { id: e.toHexString() };
        })
      : null;
  },
  validatedBy: async (parent, _, { userLoader }): Promise<GPriorityUser['validatedBy']> => {
    const user = await userLoader.load(parent.id);
    return user.validatedBy ? { id: user.validatedBy.toHexString() } : null;
  },
  emergencyRequests: async (parent, _, { userLoader }): Promise<GPriorityUser['emergencyRequests']> => {
    const user = await userLoader.load(parent.id);
    return user.emergencyRequests.length > 0
      ? user.emergencyRequests.map((e) => {
          return { id: e.toHexString() };
        })
      : null;
  },
};
