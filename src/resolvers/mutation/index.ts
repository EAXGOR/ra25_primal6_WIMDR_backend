import { IResolverObject } from 'apollo-server-express';
import { Context } from '../../context';

import { signup } from './signup';
import { signin } from './signin';
import { signout } from './signout';
import { createEmergency } from './emergency/createEmergency';
import { handleEmergency } from './emergency/handleEmergency';
import { completeEmergency } from './emergency/completeEmergency';

export const Mutation: IResolverObject<{ id: string }, Context> = {
  signup,
  signin,
  createEmergency,
  handleEmergency,
  completeEmergency,
  signout,
};
