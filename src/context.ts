import { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';

import config from './config';

import { batchDocs } from './loaders/docLoader';
import { batchUsers } from './loaders/userLoader';
import { batchEmergencies } from './loaders/emergencyLoader';
import { batchLocations } from './loaders/locationLoader';
import { DBDoc } from './dbTypes/dbDocs';
import { DBUser } from './dbTypes/dbUser';
import { AllowedRole } from './gqlTypes/types';
import { DBEmergency } from './dbTypes/dbEmergency';
import { DBLocation } from './dbTypes/dbLocation';

export interface ContextInput {
  res: Response;
  req: Request;
  client: MongoClient;
  db: Db;
}

export interface JWTPayload {
  email: string;
  id: string;
  roles: AllowedRole[];
}

export interface Context {
  res: Response;
  req: Request;
  client: MongoClient;
  db: Db;
  userLoader: DataLoader<string, DBUser, string>;
  docLoader: DataLoader<string, DBDoc, string>;
  emergencyLoader: DataLoader<string, DBEmergency, string>;
  locationLoader: DataLoader<string, DBLocation, string>;
  isValid: boolean;
  jwt: JWTPayload;
}

const context = ({ req, res, client, db }: ContextInput): Context => {
  const userLoader = new DataLoader((ids: string[]) => batchUsers(ids, db));
  const docLoader = new DataLoader((ids: string[]) => batchDocs(ids, db));
  const emergencyLoader = new DataLoader((ids: string[]) => batchEmergencies(ids, db));
  const locationLoader = new DataLoader((ids: string[]) => batchLocations(ids, db));

  const payload: Context = {
    res,
    req,
    client,
    db,
    userLoader,
    docLoader,
    emergencyLoader,
    locationLoader,
    isValid: false,
    jwt: null,
  };

  const token = req.cookies.token || '';

  try {
    const decoded = jwt.verify(token, config.JWTSecret, {
      algorithms: ['HS512'],
      subject: 'login',
    });

    payload.isValid = true;
    payload.jwt = {
      email: (decoded as JWTPayload).email,
      roles: (decoded as JWTPayload).roles,
      id: (decoded as JWTPayload).id,
    };
  } catch (err) {
    // continue regardless of error
  }

  return payload;
};

export default context;
