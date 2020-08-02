import { IResolverObject } from 'apollo-server-express';
import { Doc as GDoc } from '../../gqlTypes/types';
import { Context } from '../../context';

export const Doc: IResolverObject<{ id: string }, Context> = {
  id: async (parent, _, { docLoader }): Promise<GDoc['id']> => {
    const doc = await docLoader.load(parent.id);
    return doc._id.toHexString();
  },
  desc: async (parent, _, { docLoader }): Promise<GDoc['desc']> => {
    const doc = await docLoader.load(parent.id);
    return doc.desc;
  },
  filename: async (parent, _, { docLoader }): Promise<GDoc['filename']> => {
    const doc = await docLoader.load(parent.id);
    return doc.filename;
  },
  mime: async (parent, _, { docLoader }): Promise<GDoc['mime']> => {
    const doc = await docLoader.load(parent.id);
    return doc.mime;
  },
  url: async (parent, _, { docLoader }): Promise<GDoc['url']> => {
    const doc = await docLoader.load(parent.id);
    return doc.url;
  },
  createdBy: async (parent, _, { docLoader }): Promise<GDoc['createdBy']> => {
    const doc = await docLoader.load(parent.id);
    return doc.createdBy ? { id: doc.createdBy.toHexString() } : null;
  },
  emergency: async (parent, _, { docLoader }): Promise<GDoc['emergency']> => {
    const doc = await docLoader.load(parent.id);
    return doc.emergency ? { id: doc.emergency.toHexString() } : null;
  },
};
